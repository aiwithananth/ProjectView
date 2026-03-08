import { useState } from 'react';
import { ChevronDown, ChevronRight, MoreVertical, Trash2, Edit2 } from 'lucide-react';
import { TaskGroup } from '../tasks/TaskGroup';
import { ChecklistPanel } from '../checklist/ChecklistPanel';
import { ProjectImportExport } from './ProjectImportExport';
import { useUpdateProject, useDeleteProject } from '../../hooks/useProjects';
import { cn } from '../../lib/utils';

export function ProjectCard({ project }) {
  const [isExpanded, setIsExpanded] = useState(!project.collapsed);
  const [showMenu, setShowMenu] = useState(false);
  
  const updateProject = useUpdateProject();
  const deleteProject = useDeleteProject();
  
  const handleToggle = () => {
    const newCollapsed = !isExpanded;
    setIsExpanded(!isExpanded);
    updateProject.mutate({
      id: project.id,
      data: { collapsed: newCollapsed },
    });
  };
  
  const handleDelete = () => {
    if (confirm(`Are you sure you want to delete "${project.name}" and all its tasks?`)) {
      deleteProject.mutate(project.id);
    }
    setShowMenu(false);
  };
  
  return (
    <div className="rounded-lg shadow-sm border overflow-hidden" style={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}>
      {/* Header */}
      <div
        className="flex items-center justify-between px-6 py-4 cursor-pointer transition-colors"
        style={{ borderLeft: `4px solid ${project.color}` }}
      >
        <div className="flex items-center gap-3 flex-1" onClick={handleToggle}>
          <button className="opacity-70 hover:opacity-100" style={{ color: 'hsl(var(--muted-foreground))' }}>
            {isExpanded ? (
              <ChevronDown className="w-5 h-5" />
            ) : (
              <ChevronRight className="w-5 h-5" />
            )}
          </button>
          
          <div className="flex-1">
            <h2 className="text-xl font-semibold" style={{ color: 'hsl(var(--foreground))' }}>{project.name}</h2>
            {project.description && (
              <p className="text-sm mt-1" style={{ color: 'hsl(var(--muted-foreground))' }}>{project.description}</p>
            )}
          </div>
          
          <div className="flex items-center gap-4 text-sm">
            <span className="font-medium" style={{ color: 'hsl(var(--foreground))' }}>
              {project.progressPercent ?? 0}%
            </span>
            <span style={{ color: 'hsl(var(--muted-foreground))' }}>{project._count?.tasks || 0} tasks</span>
            <span style={{ color: 'hsl(var(--muted-foreground))' }}>{project._count?.checklists || 0} checklists</span>
          </div>
        </div>
        
        <div className="relative ml-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
            className="p-2 rounded-md transition-colors hover:opacity-80"
            style={{ color: 'hsl(var(--muted-foreground))' }}
          >
            <MoreVertical className="w-5 h-5" />
          </button>
          
          {showMenu && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowMenu(false)}
              />
              <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg border py-1 z-20" style={{ backgroundColor: 'hsl(var(--popover))', borderColor: 'hsl(var(--border))' }}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm flex items-center gap-2 hover:opacity-90"
                  style={{ color: 'hsl(var(--foreground))' }}
                >
                  <Edit2 className="w-4 h-4" />
                  Edit Project
                </button>
                <ProjectImportExport
                  project={project}
                  onClose={() => setShowMenu(false)}
                  onSuccess={() => setShowMenu(false)}
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete();
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Project
                </button>
              </div>
            </>
          )}
        </div>
      </div>
      
      {/* Content */}
      {isExpanded && (
        <div className="px-6 py-4 space-y-6" style={{ backgroundColor: 'hsl(var(--muted) / 0.3)' }}>
          <TaskGroup projectId={project.id} />
          <ChecklistPanel projectId={project.id} />
        </div>
      )}
    </div>
  );
}

