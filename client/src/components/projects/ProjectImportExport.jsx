import { useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Download, Upload } from 'lucide-react';
import { projectsApi } from '../../api/projects';
import { taskTreeToExportRows, buildCsv, parseCsv, normalizeImportRow, COLS_SINGLE } from '../../lib/csvTasks';
import { useCreateTask } from '../../hooks/useTasks';
import { useUsers } from '../../hooks/useUsers';
import { useTags, useCreateTag } from '../../hooks/useTags';

export function ProjectImportExport({ project, onClose, onSuccess }) {
  const fileInputRef = useRef(null);
  const queryClient = useQueryClient();
  const createTask = useCreateTask();
  const { data: users } = useUsers();
  const { data: tags } = useTags();
  const createTag = useCreateTag();

  const handleExport = async () => {
    try {
      const tasks = await projectsApi.getTasks(project.id);
      const rows = taskTreeToExportRows(tasks);
      const csv = buildCsv(rows, COLS_SINGLE);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${project.name.replace(/[^a-z0-9]/gi, '_')}_tasks.csv`;
      a.click();
      URL.revokeObjectURL(url);
      onSuccess?.();
      onClose?.();
    } catch (err) {
      console.error('Export failed:', err);
      alert('Export failed: ' + (err.message || 'Unknown error'));
    }
  };

  const resolveOwnerId = (ownerName) => {
    if (!ownerName || !users?.length) return null;
    const name = ownerName.toLowerCase();
    const u = users.find(
      (x) =>
        x.name?.toLowerCase() === name ||
        x.email?.toLowerCase() === name ||
        x.name?.toLowerCase().includes(name) ||
        x.email?.toLowerCase().includes(name)
    );
    return u?.id ?? null;
  };

  const resolveOrCreateTagIds = async (tagNames, tagCache) => {
    if (!tagNames?.length) return [];
    const ids = [];
    const existing = tags || [];
    for (const name of tagNames) {
      const key = name.toLowerCase();
      let tag = tagCache.get(key) ?? existing.find((t) => t.name.toLowerCase() === key);
      if (!tag) {
        try {
          tag = await createTag.mutateAsync({ name });
          tagCache.set(key, tag);
        } catch (_) {
          tag = existing.find((t) => t.name.toLowerCase() === key);
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
      let lastRootTaskId = null;
      let created = 0;
      let errors = [];
      const tagCache = new Map();
      for (let i = 0; i < rows.length; i++) {
        const r = normalizeImportRow(rows[i]);
        if (!r.title) continue;
        const isRoot = r.level !== '';
        const ownerId = resolveOwnerId(r.owner);
        const tagIds = await resolveOrCreateTagIds(r.tags, tagCache);
        const dueDate = r.dueDate ? new Date(r.dueDate).toISOString() : null;
        const startDate = r.startDate ? new Date(r.startDate).toISOString() : null;
        if (isRoot) {
          try {
            const task = await createTask.mutateAsync({
              projectId: project.id,
              parentId: null,
              title: r.title,
              description: r.description || undefined,
              ownerId: ownerId || undefined,
              startDate,
              dueDate,
              status: r.status,
              phase: r.phase,
              progress: r.progress,
              tagIds,
            });
            lastRootTaskId = task.id;
            created++;
          } catch (err) {
            errors.push(`Row ${i + 2}: ${err.message || 'Failed'}`);
          }
        } else {
          if (!lastRootTaskId) {
            errors.push(`Row ${i + 2}: Subtask must follow a task row (first column "Task").`);
            continue;
          }
          try {
            await createTask.mutateAsync({
              projectId: project.id,
              parentId: lastRootTaskId,
              title: r.title,
              description: r.description || undefined,
              ownerId: ownerId || undefined,
              startDate,
              dueDate,
              status: r.status,
              phase: r.phase,
              progress: r.progress,
              tagIds,
            });
            created++;
          } catch (err) {
            errors.push(`Row ${i + 2}: ${err.message || 'Failed'}`);
          }
        }
      }
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      if (errors.length) {
        alert(`Imported ${created} task(s). Errors:\n${errors.slice(0, 5).join('\n')}${errors.length > 5 ? '\n...' : ''}`);
      } else {
        alert(`Imported ${created} task(s) successfully.`);
      }
      onSuccess?.();
      onClose?.();
    } catch (err) {
      console.error('Import failed:', err);
      alert('Import failed: ' + (err.message || 'Unknown error'));
    }
  };

  return (
    <div className="flex flex-col gap-2 p-2">
      <button
        type="button"
        onClick={handleExport}
        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2 rounded"
      >
        <Download className="w-4 h-4" />
        Export to CSV
      </button>
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2 rounded"
      >
        <Upload className="w-4 h-4" />
        Import from CSV
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv"
        className="hidden"
        onChange={handleImport}
      />
    </div>
  );
}
