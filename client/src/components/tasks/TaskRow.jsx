import { useState } from 'react';
import { ChevronRight, ChevronDown, Plus, Trash2, GripVertical, MessageSquare } from 'lucide-react';
import { StatusBadge } from './StatusBadge';
import { PhaseBadge } from './PhaseBadge';
import { TagPills } from './TagPills';
import { OwnerAvatar } from './OwnerAvatar';
import { ProgressBar } from './ProgressBar';
import { formatDate, displayProgress, hasOverdueDescendant } from '../../lib/utils';
import { useTaskStore } from '../../store/useTaskStore';
import { useUpdateTask, useDeleteTask } from '../../hooks/useTasks';
import { cn } from '../../lib/utils';
import { TaskCommentsModal } from './TaskCommentsModal';

export function TaskRow({ task, depth = 0, projectId, onAddSubtask, onEdit }) {
  const { expandedTasks, toggleTaskExpand } = useTaskStore();
  const isExpanded = expandedTasks.has(task.id);
  const hasChildren = task.children && task.children.length > 0;
  const indent = depth * 24; // px
  
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();
  
  const [showActions, setShowActions] = useState(false);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const progressValue = hasChildren ? displayProgress(task) : task.progress;
  const isParentOverdue = hasChildren && hasOverdueDescendant(task);

  const handleStatusClick = () => {
    const statuses = ['PENDING', 'IN_PROGRESS', 'ON_TRACK', 'BLOCKED', 'OVERDUE', 'DONE'];
    const currentIndex = statuses.indexOf(task.status);
    const nextStatus = statuses[(currentIndex + 1) % statuses.length];
    
    updateTask.mutate({
      id: task.id,
      data: { status: nextStatus },
    });
  };
  
  const handlePhaseClick = () => {
    const phases = [null, 'DEV', 'TEST', 'REVIEW'];
    const currentIndex = phases.indexOf(task.phase);
    const nextPhase = phases[(currentIndex + 1) % phases.length];
    
    updateTask.mutate({
      id: task.id,
      data: { phase: nextPhase },
    });
  };
  
  const handleProgressChange = (e) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value)) {
      updateTask.mutate({
        id: task.id,
        data: { progress: value },
      });
    }
  };
  
  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this task and all its subtasks?')) {
      deleteTask.mutate(task.id);
    }
  };
  
  return (
    <>
      <tr
        className={cn(
          'group border-b transition-colors hover:bg-[hsl(var(--muted)/0.4)]',
          depth > 0 && 'opacity-95',
          isParentOverdue && 'border-l-4 border-l-red-400'
        )}
        style={{
          borderColor: 'hsl(var(--border))',
          backgroundColor: isParentOverdue ? 'hsl(0 84% 60% / 0.1)' : 'transparent',
        }}
        onMouseEnter={() => setShowActions(true)}
        onMouseLeave={() => setShowActions(false)}
      >
        {/* Title with tree structure */}
        <td className="py-3 px-4" style={{ paddingLeft: `${indent + 16}px` }}>
          <div className="flex items-center gap-2">
            {/* Drag handle */}
            <GripVertical className="w-4 h-4 cursor-grab opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: 'hsl(var(--muted-foreground))' }} />
            
            {/* Expand/collapse button */}
            {hasChildren ? (
              <button
                onClick={() => toggleTaskExpand(task.id)}
                className="transition-colors hover:opacity-80"
                style={{ color: 'hsl(var(--muted-foreground))' }}
              >
                {isExpanded ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </button>
            ) : (
              <div className="w-4" />
            )}
            
            {/* Tree connector line */}
            {depth > 0 && (
              <div className="task-connector" />
            )}
            
            {/* Task title */}
            <button
              onClick={() => onEdit && onEdit(task)}
              className="text-left font-medium transition-colors hover:opacity-80"
              style={{ color: 'hsl(var(--foreground))' }}
            >
              {task.title}
            </button>
            
            {/* Add subtask button */}
            <button
              onClick={() => onAddSubtask && onAddSubtask(task.id)}
              className={cn('transition-all', showActions ? 'opacity-100' : 'opacity-0')}
              style={{ color: 'hsl(var(--primary))' }}
              title="Add subtask"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          
          {/* Description */}
          {task.description && (
            <div className="text-sm mt-1 ml-10" style={{ color: 'hsl(var(--muted-foreground))' }}>
              {task.description}
            </div>
          )}
        </td>
        
        {/* Owner */}
        <td className="py-3 px-4 whitespace-nowrap">
          <OwnerAvatar user={task.owner} />
        </td>
        
        {/* Progress */}
        <td className="py-3 px-4">
          <div className="flex items-center gap-2">
            <ProgressBar value={progressValue} />
            {hasChildren ? (
              <span className="text-xs w-14" style={{ color: 'hsl(var(--muted-foreground))' }}>(avg)</span>
            ) : (
              <input
                type="number"
                min="0"
                max="100"
                value={task.progress}
                onChange={handleProgressChange}
                className="w-14 px-2 py-1 text-xs border rounded focus:outline-none focus:ring-1 focus:ring-offset-0"
                style={{ borderColor: 'hsl(var(--input))', backgroundColor: 'hsl(var(--background))', color: 'hsl(var(--foreground))' }}
              />
            )}
          </div>
        </td>
        
        {/* Due Date */}
        <td className="py-3 px-4 whitespace-nowrap text-sm" style={{ color: 'hsl(var(--foreground))' }}>
          {task.dueDate ? formatDate(task.dueDate) : '—'}
        </td>
        
        {/* Status */}
        <td className="py-3 px-4 whitespace-nowrap">
          <StatusBadge status={task.status} onClick={handleStatusClick} />
        </td>
        
        {/* Phase */}
        <td className="py-3 px-4 whitespace-nowrap">
          <PhaseBadge phase={task.phase} onClick={handlePhaseClick} />
        </td>
        
        {/* Tags */}
        <td className="py-3 px-4">
          <TagPills tags={task.tags} />
        </td>
        
        {/* Actions */}
        <td className="py-3 px-4 whitespace-nowrap">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCommentsOpen(true)}
              className={cn('transition-all', showActions ? 'opacity-100' : 'opacity-0')}
              style={{ color: 'hsl(var(--muted-foreground))' }}
              title="Comments"
            >
              <MessageSquare className="w-4 h-4" />
            </button>
            <button
              onClick={handleDelete}
              className={cn(
                'text-red-500 hover:text-red-700 transition-all',
                showActions ? 'opacity-100' : 'opacity-0'
              )}
              title="Delete task"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
          <TaskCommentsModal
            taskId={task.id}
            taskTitle={task.title}
            isOpen={commentsOpen}
            onClose={() => setCommentsOpen(false)}
          />
        </td>
      </tr>
      
      {/* Recursively render children */}
      {isExpanded && hasChildren && task.children.map((child) => (
        <TaskRow
          key={child.id}
          task={child}
          depth={depth + 1}
          projectId={projectId}
          onAddSubtask={onAddSubtask}
          onEdit={onEdit}
        />
      ))}
    </>
  );
}

