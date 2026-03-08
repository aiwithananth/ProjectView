import { useState } from 'react';
import { format } from 'date-fns';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { useTaskComments, useAddComment } from '../../hooks/useComments';
import { formatDistanceToNow } from 'date-fns';

function groupCommentsByDate(comments) {
  if (!comments?.length) return [];
  const groups = [];
  let currentDate = null;
  let currentGroup = null;
  comments.forEach((c) => {
    const d = format(new Date(c.createdAt), 'yyyy-MM-dd');
    if (d !== currentDate) {
      currentDate = d;
      currentGroup = { date: currentDate, label: format(new Date(c.createdAt), 'MMMM d, yyyy'), comments: [] };
      groups.push(currentGroup);
    }
    currentGroup.comments.push(c);
  });
  return groups;
}

export function TaskCommentsModal({ taskId, taskTitle, isOpen, onClose }) {
  const { data: comments, isLoading } = useTaskComments(taskId);
  const addComment = useAddComment(taskId);
  const [body, setBody] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!body.trim()) return;
    try {
      await addComment.mutateAsync({ body: body.trim() });
      setBody('');
    } catch (err) {
      console.error(err);
    }
  };

  const byDate = groupCommentsByDate(comments);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Comments: ${taskTitle}`}
      size="md"
    >
      <div className="flex flex-col gap-4">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Add a comment..."
            rows={2}
            className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-offset-0"
            style={{ borderColor: 'hsl(var(--input))', backgroundColor: 'hsl(var(--background))', color: 'hsl(var(--foreground))' }}
          />
          <Button type="submit" disabled={!body.trim() || addComment.isPending}>
            Add
          </Button>
        </form>

        <div className="border-t pt-4" style={{ borderColor: 'hsl(var(--border))' }}>
          <h4 className="text-sm font-medium mb-2" style={{ color: 'hsl(var(--foreground))' }}>Timeline (date-wise)</h4>
          {isLoading ? (
            <p className="text-sm" style={{ color: 'hsl(var(--muted-foreground))' }}>Loading...</p>
          ) : !comments || comments.length === 0 ? (
            <p className="text-sm" style={{ color: 'hsl(var(--muted-foreground))' }}>No comments yet.</p>
          ) : (
            <div className="space-y-4">
              {byDate.map((group) => (
                <div key={group.date}>
                  <div className="text-xs font-medium mb-2" style={{ color: 'hsl(var(--muted-foreground))' }}>{group.label}</div>
                  <ul className="space-y-2">
                    {group.comments.map((comment) => (
                      <li
                        key={comment.id}
                        className="flex gap-3 p-3 rounded-lg border"
                        style={{ backgroundColor: 'hsl(var(--muted) / 0.5)', borderColor: 'hsl(var(--border))' }}
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-sm" style={{ color: 'hsl(var(--foreground))' }}>{comment.body}</p>
                          <p className="text-xs mt-1" style={{ color: 'hsl(var(--muted-foreground))' }}>
                            {comment.author?.name} · {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
