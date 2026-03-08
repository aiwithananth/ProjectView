import { useState } from 'react';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { useCreateProject } from '../../hooks/useProjects';

const PRESET_COLORS = [
  '#6366f1', // indigo
  '#ec4899', // pink
  '#10b981', // green
  '#f59e0b', // amber
  '#3b82f6', // blue
  '#8b5cf6', // purple
  '#ef4444', // red
  '#14b8a6', // teal
];

export function AddProjectModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: '#6366f1',
  });
  
  const createProject = useCreateProject();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await createProject.mutateAsync(formData);
      setFormData({ name: '', description: '', color: '#6366f1' });
      onClose();
    } catch (error) {
      console.error('Failed to create project:', error);
    }
  };
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Project">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Project Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Enter project name"
          required
        />
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Enter project description (optional)"
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Color
          </label>
          <div className="flex gap-2">
            {PRESET_COLORS.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => setFormData({ ...formData, color })}
                className={`w-10 h-10 rounded-md border-2 transition-all ${
                  formData.color === color ? 'border-gray-900 scale-110' : 'border-transparent'
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>
        
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={createProject.isPending}>
            Create Project
          </Button>
        </div>
      </form>
    </Modal>
  );
}

