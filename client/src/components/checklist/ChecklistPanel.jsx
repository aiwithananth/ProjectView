import { useState } from 'react';
import { Plus, ChevronDown, ChevronRight, Trash2 } from 'lucide-react';
import { ChecklistItem } from './ChecklistItem';
import { useProjectChecklists, useCreateChecklist, useDeleteChecklist, useAddChecklistItem } from '../../hooks/useChecklists';
import { cn } from '../../lib/utils';

export function ChecklistPanel({ projectId }) {
  const { data: checklists, isLoading } = useProjectChecklists(projectId);
  const createChecklist = useCreateChecklist();
  const deleteChecklist = useDeleteChecklist();
  const addItem = useAddChecklistItem();
  
  const [expandedChecklists, setExpandedChecklists] = useState(new Set());
  const [newChecklistTitle, setNewChecklistTitle] = useState('');
  const [isAddingChecklist, setIsAddingChecklist] = useState(false);
  const [newItemLabels, setNewItemLabels] = useState({});
  
  const toggleChecklist = (checklistId) => {
    const newExpanded = new Set(expandedChecklists);
    if (newExpanded.has(checklistId)) {
      newExpanded.delete(checklistId);
    } else {
      newExpanded.add(checklistId);
    }
    setExpandedChecklists(newExpanded);
  };
  
  const handleCreateChecklist = async (e) => {
    e.preventDefault();
    if (!newChecklistTitle.trim()) return;
    
    try {
      const checklist = await createChecklist.mutateAsync({
        title: newChecklistTitle,
        projectId,
      });
      setNewChecklistTitle('');
      setIsAddingChecklist(false);
      setExpandedChecklists(new Set([...expandedChecklists, checklist.id]));
    } catch (error) {
      console.error('Failed to create checklist:', error);
    }
  };
  
  const handleDeleteChecklist = async (checklistId) => {
    if (confirm('Are you sure you want to delete this checklist?')) {
      try {
        await deleteChecklist.mutateAsync(checklistId);
      } catch (error) {
        console.error('Failed to delete checklist:', error);
      }
    }
  };
  
  const handleAddItem = async (checklistId) => {
    const label = newItemLabels[checklistId];
    if (!label?.trim()) return;
    
    try {
      await addItem.mutateAsync({
        checklistId,
        data: { label },
      });
      setNewItemLabels({ ...newItemLabels, [checklistId]: '' });
    } catch (error) {
      console.error('Failed to add item:', error);
    }
  };
  
  if (isLoading) {
    return <div className="text-sm" style={{ color: 'hsl(var(--muted-foreground))' }}>Loading checklists...</div>;
  }
  
  const getChecklistProgress = (checklist) => {
    if (!checklist.items || checklist.items.length === 0) return 0;
    const completed = checklist.items.filter(item => item.done).length;
    return Math.round((completed / checklist.items.length) * 100);
  };
  
  return (
    <div className="rounded-lg shadow overflow-hidden border" style={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b" style={{ backgroundColor: 'hsl(var(--muted))', borderColor: 'hsl(var(--border))' }}>
        <h3 className="font-semibold" style={{ color: 'hsl(var(--foreground))' }}>Checklists</h3>
        <button
          onClick={() => setIsAddingChecklist(true)}
          className="inline-flex items-center gap-1 px-3 py-1.5 text-sm rounded-md transition-colors"
          style={{ backgroundColor: 'hsl(var(--primary))', color: 'hsl(var(--primary-foreground))' }}
        >
          <Plus className="w-4 h-4" />
          Add Checklist
        </button>
      </div>
      
      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Add new checklist form */}
        {isAddingChecklist && (
          <form onSubmit={handleCreateChecklist} className="flex gap-2 p-3 rounded-md" style={{ backgroundColor: 'hsl(var(--muted) / 0.5)' }}>
            <input
              type="text"
              value={newChecklistTitle}
              onChange={(e) => setNewChecklistTitle(e.target.value)}
              placeholder="Checklist title"
              className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-offset-0"
              style={{ borderColor: 'hsl(var(--input))', backgroundColor: 'hsl(var(--background))', color: 'hsl(var(--foreground))' }}
              autoFocus
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-md transition-colors"
              style={{ backgroundColor: 'hsl(var(--primary))', color: 'hsl(var(--primary-foreground))' }}
            >
              Add
            </button>
            <button
              type="button"
              onClick={() => {
                setIsAddingChecklist(false);
                setNewChecklistTitle('');
              }}
              className="px-4 py-2 rounded-md transition-colors"
              style={{ backgroundColor: 'hsl(var(--muted))', color: 'hsl(var(--foreground))' }}
            >
              Cancel
            </button>
          </form>
        )}
        
        {/* Checklists */}
        {checklists && checklists.length > 0 ? (
          <div className="space-y-3">
            {checklists.map((checklist) => {
              const isExpanded = expandedChecklists.has(checklist.id);
              const progress = getChecklistProgress(checklist);
              const completedCount = checklist.items?.filter(item => item.done).length || 0;
              const totalCount = checklist.items?.length || 0;
              
              return (
                <div key={checklist.id} className="border rounded-md overflow-hidden" style={{ borderColor: 'hsl(var(--border))' }}>
                  {/* Checklist header */}
                  <div
                    className="flex items-center justify-between px-4 py-3 cursor-pointer transition-colors hover:opacity-90"
                    style={{ backgroundColor: 'hsl(var(--muted))' }}
                    onClick={() => toggleChecklist(checklist.id)}
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <button style={{ color: 'hsl(var(--muted-foreground))' }}>
                        {isExpanded ? (
                          <ChevronDown className="w-4 h-4" />
                        ) : (
                          <ChevronRight className="w-4 h-4" />
                        )}
                      </button>
                      <div className="flex-1">
                        <h4 className="font-medium" style={{ color: 'hsl(var(--foreground))' }}>{checklist.title}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex-1 max-w-xs h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'hsl(var(--muted))' }}>
                            <div
                              className="h-full transition-all duration-300"
                              style={{ width: `${progress}%`, backgroundColor: progress === 100 ? 'hsl(142 71% 45%)' : 'hsl(var(--primary))' }}
                            />
                          </div>
                          <span className="text-xs" style={{ color: 'hsl(var(--muted-foreground))' }}>
                            {completedCount}/{totalCount}
                          </span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteChecklist(checklist.id);
                      }}
                      className="text-red-500 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  
                  {/* Checklist items */}
                  {isExpanded && (
                    <div className="p-4 space-y-2" style={{ backgroundColor: 'hsl(var(--card))' }}>
                      {checklist.items?.map((item) => (
                        <ChecklistItem key={item.id} item={item} />
                      ))}
                      
                      {/* Add new item */}
                      <div className="flex gap-2 pt-2">
                        <input
                          type="text"
                          value={newItemLabels[checklist.id] || ''}
                          onChange={(e) => setNewItemLabels({ ...newItemLabels, [checklist.id]: e.target.value })}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddItem(checklist.id);
                            }
                          }}
                          placeholder="Add new item..."
                          className="flex-1 px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-offset-0"
                          style={{ borderColor: 'hsl(var(--input))', backgroundColor: 'hsl(var(--background))', color: 'hsl(var(--foreground))' }}
                        />
                        <button
                          onClick={() => handleAddItem(checklist.id)}
                          className="px-3 py-2 text-sm rounded-md transition-colors"
                          style={{ backgroundColor: 'hsl(var(--primary))', color: 'hsl(var(--primary-foreground))' }}
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          !isAddingChecklist && (
            <div className="text-center py-6" style={{ color: 'hsl(var(--muted-foreground))' }}>
              No checklists yet. Click "Add Checklist" to create one.
            </div>
          )
        )}
      </div>
    </div>
  );
}

