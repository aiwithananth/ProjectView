import { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { Select } from '../common/Select';
import { DatePicker } from '../common/DatePicker';
import { OwnerPillSelect } from './OwnerPillSelect';
import { TagPillSelect } from './TagPillSelect';
import { useCreateTask, useUpdateTask } from '../../hooks/useTasks';

export function AddTaskModal({ isOpen, onClose, projectId, parentId, editingTask }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    ownerId: null,
    startDate: null,
    dueDate: null,
    status: 'PENDING',
    phase: null,
    progress: 0,
    tagIds: [],
  });
  
  const createTask = useCreateTask();
  const updateTask = useUpdateTask();
  const hasSubtasks = editingTask?.children?.length > 0;
  
  useEffect(() => {
    if (editingTask) {
      setFormData({
        title: editingTask.title || '',
        description: editingTask.description || '',
        ownerId: editingTask.ownerId || null,
        startDate: editingTask.startDate || null,
        dueDate: editingTask.dueDate || null,
        status: editingTask.status || 'PENDING',
        phase: editingTask.phase || null,
        progress: editingTask.progress || 0,
        tagIds: editingTask.tags?.map(t => t.id) || [],
      });
    } else {
      setFormData({
        title: '',
        description: '',
        ownerId: null,
        startDate: null,
        dueDate: null,
        status: 'PENDING',
        phase: null,
        progress: 0,
        tagIds: [],
      });
    }
  }, [editingTask, isOpen]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingTask) {
        await updateTask.mutateAsync({
          id: editingTask.id,
          data: formData,
        });
      } else {
        await createTask.mutateAsync({
          ...formData,
          projectId,
          parentId,
        });
      }
      onClose();
    } catch (error) {
      console.error('Failed to save task:', error);
    }
  };
  
  const statusOptions = [
    { value: 'PENDING', label: 'Pending' },
    { value: 'IN_PROGRESS', label: 'In Progress' },
    { value: 'ON_TRACK', label: 'On Track' },
    { value: 'BLOCKED', label: 'Blocked' },
    { value: 'OVERDUE', label: 'Overdue' },
    { value: 'DONE', label: 'Done' },
  ];
  
  const phaseOptions = [
    { value: 'DEV', label: 'Dev' },
    { value: 'TEST', label: 'Test' },
    { value: 'REVIEW', label: 'Review' },
  ];
  
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingTask ? 'Edit Task' : parentId ? 'Add Subtask' : 'Add Task'}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Enter task title"
          required
        />
        
        <div>
          <label className="block text-sm font-medium mb-1.5" style={{ color: 'hsl(var(--foreground))' }}>
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Enter task description (optional)"
            rows={3}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-offset-0"
            style={{ borderColor: 'hsl(var(--input))', backgroundColor: 'hsl(var(--background))', color: 'hsl(var(--foreground))' }}
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <OwnerPillSelect
            value={formData.ownerId}
            onChange={(value) => setFormData({ ...formData, ownerId: value })}
          />
          <DatePicker
            label="Start Date"
            value={formData.startDate}
            onChange={(value) => setFormData({ ...formData, startDate: value })}
          />
          <DatePicker
            label="Due Date"
            value={formData.dueDate}
            onChange={(value) => setFormData({ ...formData, dueDate: value })}
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <Select
            label="Status"
            value={formData.status}
            onChange={(value) => setFormData({ ...formData, status: value })}
            options={statusOptions}
          />
          
          <Select
            label="Phase"
            value={formData.phase}
            onChange={(value) => setFormData({ ...formData, phase: value })}
            options={phaseOptions}
            placeholder="Select phase (optional)"
          />
        </div>
        
        <TagPillSelect
          value={formData.tagIds}
          onChange={(tagIds) => setFormData({ ...formData, tagIds })}
        />

        <div>
          <label className="block text-sm font-medium mb-1.5" style={{ color: 'hsl(var(--foreground))' }}>
            Progress: {formData.progress}%
          </label>
          {hasSubtasks ? (
            <p className="text-sm" style={{ color: 'hsl(var(--muted-foreground))' }}>Progress is determined by subtask average.</p>
          ) : (
            <input
              type="range"
              min="0"
              max="100"
              value={formData.progress}
              onChange={(e) => setFormData({ ...formData, progress: parseInt(e.target.value) })}
              className="w-full"
            />
          )}
        </div>
        
        <div className="flex justify-end gap-3 pt-4 border-t" style={{ borderColor: 'hsl(var(--border))' }}>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={createTask.isPending || updateTask.isPending}>
            {editingTask ? 'Update Task' : 'Create Task'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

