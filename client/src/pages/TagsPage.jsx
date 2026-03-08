import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { useTags, useCreateTag, useDeleteTag } from '../hooks/useTags';
import { Modal } from '../components/common/Modal';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';

const PRESET_COLORS = [
  '#3b82f6', '#10b981', '#f59e0b', '#ef4444',
  '#8b5cf6', '#ec4899', '#14b8a6', '#6366f1',
];

export function TagsPage() {
  const { data: tags, isLoading } = useTags();
  const createTag = useCreateTag();
  const deleteTag = useDeleteTag();
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    color: '#3b82f6',
  });
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createTag.mutateAsync(formData);
      setFormData({ name: '', color: '#3b82f6' });
      setIsAddModalOpen(false);
    } catch (error) {
      console.error('Failed to create tag:', error);
    }
  };
  
  const handleDelete = async (tagId) => {
    if (confirm('Are you sure you want to delete this tag?')) {
      try {
        await deleteTag.mutateAsync(tagId);
      } catch (error) {
        console.error('Failed to delete tag:', error);
      }
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-gray-500">Loading tags...</div>
      </div>
    );
  }
  
  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tags</h1>
          <p className="text-gray-500 mt-1">Organize tasks with tags</p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Tag
        </button>
      </div>
      
      {/* Tags Grid */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase">Tag</th>
              <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase">Color</th>
              <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase">Tasks</th>
              <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {tags?.map((tag) => (
              <tr key={tag.id} className="hover:bg-gray-50">
                <td className="py-4 px-6">
                  <span
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border"
                    style={{
                      backgroundColor: `${tag.color}20`,
                      borderColor: `${tag.color}40`,
                      color: tag.color,
                    }}
                  >
                    {tag.name}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-6 h-6 rounded border border-gray-300"
                      style={{ backgroundColor: tag.color }}
                    />
                    <span className="text-sm text-gray-600">{tag.color}</span>
                  </div>
                </td>
                <td className="py-4 px-6 text-sm text-gray-600">
                  {tag._count?.tasks || 0} tasks
                </td>
                <td className="py-4 px-6">
                  <button
                    onClick={() => handleDelete(tag.id)}
                    className="text-red-500 hover:text-red-700 transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Add Tag Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Tag"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Tag Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Enter tag name"
            required
          />
          
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
            <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={createTag.isPending}>
              Add Tag
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

