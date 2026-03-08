import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const STATUS_CONFIG = {
  OVERDUE: { label: 'Overdue', color: 'bg-red-100 text-red-700 border-red-200' },
  ON_TRACK: { label: 'On Track', color: 'bg-green-100 text-green-700 border-green-200' },
  IN_PROGRESS: { label: 'In Progress', color: 'bg-blue-100 text-blue-700 border-blue-200' },
  BLOCKED: { label: 'Blocked', color: 'bg-orange-100 text-orange-700 border-orange-200' },
  PENDING: { label: 'Pending', color: 'bg-gray-100 text-gray-600 border-gray-200' },
  DONE: { label: 'Done', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
};

export const PHASE_CONFIG = {
  DEV: { label: 'Dev', color: 'bg-violet-100 text-violet-700 border-violet-200' },
  TEST: { label: 'Test', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
  REVIEW: { label: 'Review', color: 'bg-pink-100 text-pink-700 border-pink-200' },
};

export function formatDate(date) {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function formatDateInput(date) {
  if (!date) return '';
  const d = new Date(date);
  return d.toISOString().split('T')[0];
}

export function isOverdue(dueDate) {
  if (!dueDate) return false;
  return new Date(dueDate) < new Date();
}

/** Display progress: for parents, avg of children; for leaves, task.progress. */
export function displayProgress(task) {
  if (!task) return 0;
  const children = task.children || [];
  if (children.length === 0) return task.progress ?? 0;
  const sum = children.reduce((acc, c) => acc + displayProgress(c), 0);
  return Math.round(sum / children.length);
}

/** Whether this task or any descendant is overdue. */
export function hasOverdueDescendant(task) {
  if (!task) return false;
  if (isOverdue(task.dueDate)) return true;
  return (task.children || []).some(hasOverdueDescendant);
}

