import { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { useChecklistItemComments, useAddChecklistItemComment } from '../../hooks/useChecklists';
import { useUpdateChecklistItem } from '../../hooks/useChecklists';
import { format, formatDistanceToNow } from 'date-fns';

const STATUS_OPTIONS = [
  { value: 'pending', label: 'Pending' },
  { value: 'in_progress', label: 'In progress' },
  { value: 'done', label: 'Done' },
];

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

export function ChecklistItemModal({ item, isOpen, onClose }) {
  const currentStatus = item?.status || (item?.done ? 'done' : 'pending');
  const [status, setStatus] = useState(currentStatus);
  const [commentBody, setCommentBody] = useState('');
  const [commentStatus, setCommentStatus] = useState(currentStatus);

  useEffect(() => {
    if (isOpen && item) {
      const s = item.status || (item.done ? 'done' : 'pending');
      setStatus(s);
      setCommentStatus(s);
    }
  }, [isOpen, item, item?.status, item?.done]);

  const { data: comments, isLoading } = useChecklistItemComments(item?.id);
  const addComment = useAddChecklistItemComment(item?.id);
  const updateItem = useUpdateChecklistItem();

  const handleStatusChange = (newStatus) => {
    setStatus(newStatus);
    updateItem.mutate({
      itemId: item.id,
      data: { status: newStatus },
    });
  };

  const handleAddComment = async (e) => {
    e?.preventDefault?.();
    if (!commentBody.trim()) return;
    try {
      await addComment.mutateAsync({
        body: commentBody.trim(),
        statusAtChange: commentStatus,
      });
      setCommentBody('');
    } catch (err) {
      console.error(err);
    }
  };

  const byDate = groupCommentsByDate(comments);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={item?.label ?? 'Checklist item'}
      size="md"
    >
      <div className="space-y-4">
        {/* Current status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Status</label>
          <select
            value={status}
            onChange={(e) => handleStatusChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Add comment */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Add comment</label>
          <div className="flex gap-2">
            <select
              value={commentStatus}
              onChange={(e) => setCommentStatus(e.target.value)}
              className="px-2 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              title="Status when commenting"
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <textarea
              value={commentBody}
              onChange={(e) => setCommentBody(e.target.value)}
              placeholder="Add a comment..."
              rows={2}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Button
              type="button"
              onClick={handleAddComment}
              disabled={!commentBody.trim() || addComment.isPending}
            >
              Add
            </Button>
          </div>
        </div>

        {/* Timeline by date */}
        <div className="border-t pt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Timeline (date-wise)</h4>
          {isLoading ? (
            <p className="text-sm text-gray-500">Loading...</p>
          ) : !comments?.length ? (
            <p className="text-sm text-gray-500">No comments yet.</p>
          ) : (
            <div className="space-y-4">
              {byDate.map((group) => (
                <div key={group.date}>
                  <div className="text-xs font-medium text-gray-500 mb-2">{group.label}</div>
                  <ul className="space-y-2">
                    {group.comments.map((c) => (
                      <li
                        key={c.id}
                        className="flex gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-900">{c.body}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {c.author?.name}
                            {c.statusAtChange && (
                              <span className="ml-2 px-1.5 py-0.5 bg-gray-200 rounded text-gray-600">
                                {STATUS_OPTIONS.find((o) => o.value === c.statusAtChange)?.label ?? c.statusAtChange}
                              </span>
                            )}
                            {' · '}
                            {formatDistanceToNow(new Date(c.createdAt), { addSuffix: true })}
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
