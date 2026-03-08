import { useState } from 'react';
import { Plus } from 'lucide-react';
import { TaskRow } from './TaskRow';
import { AddTaskModal } from './AddTaskModal';
import { useProjectTasks } from '../../hooks/useProjects';
import { useTaskStore } from '../../store/useTaskStore';

export function TaskGroup({ projectId }) {
  const { data: tasks, isLoading } = useProjectTasks(projectId);
  const { expandAll, collapseAll } = useTaskStore();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [parentTaskId, setParentTaskId] = useState(null);
  const [editingTask, setEditingTask] = useState(null);
  
  const handleAddSubtask = (taskId) => {
    setParentTaskId(taskId);
    setIsAddModalOpen(true);
  };
  
  const handleAddRootTask = () => {
    setParentTaskId(null);
    setIsAddModalOpen(true);
  };
  
  const handleEdit = (task) => {
    setEditingTask(task);
    setIsAddModalOpen(true);
  };
  
  const handleCloseModal = () => {
    setIsAddModalOpen(false);
    setParentTaskId(null);
    setEditingTask(null);
  };
  
  const getAllTaskIds = (tasks) => {
    const ids = [];
    const traverse = (task) => {
      ids.push(task.id);
      if (task.children) {
        task.children.forEach(traverse);
      }
    };
    tasks.forEach(traverse);
    return ids;
  };
  
  const handleExpandAll = () => {
    if (tasks) {
      expandAll(getAllTaskIds(tasks));
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12" style={{ color: 'hsl(var(--muted-foreground))' }}>
        Loading tasks...
      </div>
    );
  }
  
  if (!tasks || tasks.length === 0) {
    return (
      <>
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <p className="mb-4" style={{ color: 'hsl(var(--muted-foreground))' }}>No tasks yet</p>
          <button
            onClick={handleAddRootTask}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-md transition-colors"
            style={{ backgroundColor: 'hsl(var(--primary))', color: 'hsl(var(--primary-foreground))' }}
          >
            <Plus className="w-4 h-4" />
            Add First Task
          </button>
        </div>
        <AddTaskModal
          isOpen={isAddModalOpen}
          onClose={handleCloseModal}
          projectId={projectId}
          parentId={parentTaskId}
          editingTask={editingTask}
        />
      </>
    );
  }
  
  return (
    <div className="rounded-lg shadow overflow-hidden border" style={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b" style={{ backgroundColor: 'hsl(var(--muted))', borderColor: 'hsl(var(--border))' }}>
        <h3 className="font-semibold" style={{ color: 'hsl(var(--foreground))' }}>Tasks</h3>
        <div className="flex items-center gap-2">
          <button
            onClick={handleExpandAll}
            className="text-sm transition-colors hover:opacity-90"
            style={{ color: 'hsl(var(--muted-foreground))' }}
          >
            Expand All
          </button>
          <button
            onClick={collapseAll}
            className="text-sm transition-colors hover:opacity-90"
            style={{ color: 'hsl(var(--muted-foreground))' }}
          >
            Collapse All
          </button>
          <button
            onClick={handleAddRootTask}
            className="inline-flex items-center gap-1 px-3 py-1.5 text-sm rounded-md transition-colors"
            style={{ backgroundColor: 'hsl(var(--primary))', color: 'hsl(var(--primary-foreground))' }}
          >
            <Plus className="w-4 h-4" />
            Add Task
          </button>
        </div>
      </div>
      
      {/* Task table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="border-b" style={{ backgroundColor: 'hsl(var(--muted))', borderColor: 'hsl(var(--border))' }}>
            <tr>
              <th className="py-3 px-4 text-left text-xs font-medium uppercase tracking-wider" style={{ color: 'hsl(var(--muted-foreground))' }}>Task</th>
              <th className="py-3 px-4 text-left text-xs font-medium uppercase tracking-wider" style={{ color: 'hsl(var(--muted-foreground))' }}>Owner</th>
              <th className="py-3 px-4 text-left text-xs font-medium uppercase tracking-wider" style={{ color: 'hsl(var(--muted-foreground))' }}>Progress</th>
              <th className="py-3 px-4 text-left text-xs font-medium uppercase tracking-wider" style={{ color: 'hsl(var(--muted-foreground))' }}>Due Date</th>
              <th className="py-3 px-4 text-left text-xs font-medium uppercase tracking-wider" style={{ color: 'hsl(var(--muted-foreground))' }}>Status</th>
              <th className="py-3 px-4 text-left text-xs font-medium uppercase tracking-wider" style={{ color: 'hsl(var(--muted-foreground))' }}>Phase</th>
              <th className="py-3 px-4 text-left text-xs font-medium uppercase tracking-wider" style={{ color: 'hsl(var(--muted-foreground))' }}>Tags</th>
              <th className="py-3 px-4 text-left text-xs font-medium uppercase tracking-wider" style={{ color: 'hsl(var(--muted-foreground))' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <TaskRow
                key={task.id}
                task={task}
                depth={0}
                projectId={projectId}
                onAddSubtask={handleAddSubtask}
                onEdit={handleEdit}
              />
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Add/Edit Task Modal */}
      <AddTaskModal
        isOpen={isAddModalOpen}
        onClose={handleCloseModal}
        projectId={projectId}
        parentId={parentTaskId}
        editingTask={editingTask}
      />
    </div>
  );
}

