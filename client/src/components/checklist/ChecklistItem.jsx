import { useState } from 'react';
import { Trash2, MessageSquare } from 'lucide-react';
import { useUpdateChecklistItem, useDeleteChecklistItem } from '../../hooks/useChecklists';
import { cn } from '../../lib/utils';
import { ChecklistItemModal } from './ChecklistItemModal';

const STATUS_LABELS = { pending: 'Pending', in_progress: 'In progress', done: 'Done' };

export function ChecklistItem({ item }) {
  const [modalOpen, setModalOpen] = useState(false);
  const updateItem = useUpdateChecklistItem();
  const deleteItem = useDeleteChecklistItem();

  const status = item.status || (item.done ? 'done' : 'pending');
  const lastComment = item.comments?.[0];

  const handleToggle = (e) => {
    e.stopPropagation();
    const nextDone = !item.done;
    updateItem.mutate({
      itemId: item.id,
      data: { done: nextDone, status: nextDone ? 'done' : 'pending' },
    });
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    deleteItem.mutate(item.id);
  };

  return (
    <>
      <div
        onClick={() => setModalOpen(true)}
        className="flex items-center gap-3 group cursor-pointer rounded-md px-2 py-1.5 -mx-2 border border-transparent transition-colors hover:opacity-90"
        style={{ backgroundColor: 'transparent' }}
      >
        <input
          type="checkbox"
          checked={item.done}
          onChange={handleToggle}
          onClick={(e) => e.stopPropagation()}
          className="w-4 h-4 rounded border cursor-pointer shrink-0 focus:ring-2 focus:ring-offset-0"
          style={{ borderColor: 'hsl(var(--input))', accentColor: 'hsl(var(--primary))' }}
        />
        <div className="flex-1 min-w-0">
          <span
            className={cn('text-sm block', item.done && 'line-through')}
            style={{ color: item.done ? 'hsl(var(--muted-foreground))' : 'hsl(var(--foreground))' }}
          >
            {item.label}
          </span>
          <div className="flex items-center gap-2 mt-0.5 flex-wrap">
            <span className="text-xs" style={{ color: 'hsl(var(--muted-foreground))' }}>
              {STATUS_LABELS[status] || status}
            </span>
            {lastComment && (
              <span className="text-xs truncate max-w-[200px]" style={{ color: 'hsl(var(--muted-foreground))' }} title={lastComment.body}>
                <MessageSquare className="w-3 h-3 inline mr-0.5" />
                {lastComment.body}
              </span>
            )}
          </div>
        </div>
        <button
          onClick={handleDelete}
          className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 transition-all shrink-0"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
      <ChecklistItemModal
        item={item}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
}

