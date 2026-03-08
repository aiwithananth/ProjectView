import { useState } from 'react';
import { Plus } from 'lucide-react';
import { ProjectCard } from './ProjectCard';
import { AddProjectModal } from './AddProjectModal';
import { OverallImportExport } from './OverallImportExport';
import { useProjects } from '../../hooks/useProjects';

export function ProjectList() {
  const { data: projects, isLoading } = useProjects();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div style={{ color: 'hsl(var(--muted-foreground))' }}>Loading projects...</div>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h1 className="text-2xl font-bold" style={{ color: 'hsl(var(--foreground))' }}>Projects</h1>
        <div className="flex items-center gap-2">
          <OverallImportExport />
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            New Project
          </button>
        </div>
      </div>
      
      {/* Projects */}
      {projects && projects.length > 0 ? (
        <div className="space-y-4">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center rounded-lg border" style={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}>
          <p className="mb-4" style={{ color: 'hsl(var(--muted-foreground))' }}>No projects yet</p>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Create Your First Project
          </button>
        </div>
      )}
      
      {/* Add Project Modal */}
      <AddProjectModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </div>
  );
}

