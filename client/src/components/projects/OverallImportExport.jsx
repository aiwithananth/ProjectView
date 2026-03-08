import { useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Download, Upload } from 'lucide-react';
import { exportApi } from '../../api/export';
import { projectsApi } from '../../api/projects';
import { tasksApi } from '../../api/tasks';
import { parseCsv, normalizeImportRow, overallExportRowsFromData, buildCsv } from '../../lib/csvTasks';
import { useUsers } from '../../hooks/useUsers';
import { useTags, useCreateTag } from '../../hooks/useTags';

export function OverallImportExport() {
  const fileInputRef = useRef(null);
  const queryClient = useQueryClient();
  const { data: users } = useUsers();
  const { data: tags } = useTags();
  const createTag = useCreateTag();

  const handleExport = async () => {
    try {
      const data = await exportApi.getExportData();
      const rows = overallExportRowsFromData(data);
      const csv = buildCsv(rows);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `projects_tasks_export_${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Export failed:', err);
      alert('Export failed: ' + (err.message || 'Unknown error'));
    }
  };

  const resolveOwnerId = (ownerName) => {
    if (!ownerName || !users?.length) return null;
    const name = String(ownerName).trim().toLowerCase();
    const u = users.find(
      (x) =>
        x.name?.toLowerCase() === name ||
        x.email?.toLowerCase() === name ||
        (x.name && x.name.toLowerCase().includes(name)) ||
        (x.email && x.email.toLowerCase().includes(name))
    );
    return u?.id ?? null;
  };

  const resolveOrCreateTagIds = async (tagNames, tagCache) => {
    if (!tagNames?.length) return [];
    const ids = [];
    const existing = tags || [];
    for (const name of tagNames) {
      const key = name.toLowerCase();
      let tag = tagCache.get(key) ?? existing.find((t) => t.name?.toLowerCase() === key);
      if (!tag) {
        try {
          tag = await createTag.mutateAsync({ name });
          tagCache.set(key, tag);
        } catch (_) {
          tag = existing.find((t) => t.name?.toLowerCase() === key);
        }
      }
      if (tag?.id) ids.push(tag.id);
    }
    return ids;
  };

  const handleImport = async (e) => {
    const file = e.target?.files?.[0];
    if (!file) return;
    e.target.value = '';
    try {
      const text = await file.text();
      const rows = parseCsv(text);
      if (!rows.length) {
        alert('CSV is empty or invalid.');
        return;
      }
      const tagCache = new Map();
      const projectNameToId = {};
      let currentProjectId = null;
      let lastRootTaskId = null;
      let projectsCreated = 0;
      let tasksCreated = 0;
      const errors = [];

      const resolveProjectByName = async (name) => {
        if (projectNameToId[name] != null) return projectNameToId[name];
        const list = await projectsApi.getAll();
        const p = list.find((x) => x.name?.toLowerCase() === String(name).toLowerCase());
        if (p) projectNameToId[name] = p.id;
        return p?.id ?? null;
      };

      for (let i = 0; i < rows.length; i++) {
        const r = normalizeImportRow(rows[i]);
        if (r.level === 'Project') {
          if (!r.project) continue;
          try {
            const existing = await projectsApi.getAll();
            const found = existing.find((p) => p.name?.toLowerCase() === r.project.toLowerCase());
            if (found) {
              projectNameToId[r.project] = found.id;
            } else {
              const proj = await projectsApi.create({ name: r.project, description: r.description || undefined });
              projectNameToId[r.project] = proj.id;
              projectsCreated++;
            }
            currentProjectId = projectNameToId[r.project];
            lastRootTaskId = null;
          } catch (err) {
            errors.push(`Row ${i + 2} (Project): ${err.message || 'Failed'}`);
          }
          continue;
        }
        if (r.level === 'Task') {
          if (!r.title) continue;
          let projectId = currentProjectId;
          if (r.project) projectId = projectNameToId[r.project] ?? (await resolveProjectByName(r.project));
          if (!projectId) {
            errors.push(`Row ${i + 2}: Project "${r.project || ''}" not found. Create a Project row first.`);
            continue;
          }
          currentProjectId = projectId;
          try {
            const ownerId = resolveOwnerId(r.owner);
            const tagIds = await resolveOrCreateTagIds(r.tags, tagCache);
            const task = await tasksApi.create({
              projectId,
              parentId: null,
              title: r.title,
              description: r.description || undefined,
              ownerId: ownerId || undefined,
              startDate: r.startDate || null,
              dueDate: r.dueDate,
              status: r.status,
              phase: r.phase,
              progress: r.progress,
              tagIds,
            });
            lastRootTaskId = task.id;
            tasksCreated++;
          } catch (err) {
            errors.push(`Row ${i + 2}: ${err.message || 'Failed'}`);
          }
          continue;
        }
        if (r.level === '') {
          if (!r.title) continue;
          if (!lastRootTaskId || !currentProjectId) {
            errors.push(`Row ${i + 2}: Subtask must follow a Task row.`);
            continue;
          }
          try {
            const ownerId = resolveOwnerId(r.owner);
            const tagIds = await resolveOrCreateTagIds(r.tags, tagCache);
            await tasksApi.create({
              projectId: currentProjectId,
              parentId: lastRootTaskId,
              title: r.title,
              description: r.description || undefined,
              ownerId: ownerId || undefined,
              startDate: r.startDate || null,
              dueDate: r.dueDate,
              status: r.status,
              phase: r.phase,
              progress: r.progress,
              tagIds,
            });
            tasksCreated++;
          } catch (err) {
            errors.push(`Row ${i + 2}: ${err.message || 'Failed'}`);
          }
        }
      }

      queryClient.invalidateQueries({ queryKey: ['projects'] });
      if (errors.length) {
        alert(`Imported ${projectsCreated} project(s), ${tasksCreated} task(s). Errors:\n${errors.slice(0, 8).join('\n')}${errors.length > 8 ? '\n...' : ''}`);
      } else {
        alert(`Imported ${projectsCreated} project(s), ${tasksCreated} task(s) successfully.`);
      }
    } catch (err) {
      console.error('Import failed:', err);
      alert('Import failed: ' + (err.message || 'Unknown error'));
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={handleExport}
        className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
      >
        <Download className="w-4 h-4" />
        Export CSV
      </button>
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
      >
        <Upload className="w-4 h-4" />
        Import CSV
      </button>
      <input ref={fileInputRef} type="file" accept=".csv" className="hidden" onChange={handleImport} />
    </div>
  );
}
