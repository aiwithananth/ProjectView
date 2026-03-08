import { create } from 'zustand';

export const useTaskStore = create((set) => ({
  expandedTasks: new Set(),
  toggleTaskExpand: (taskId) => set((state) => {
    const newExpanded = new Set(state.expandedTasks);
    if (newExpanded.has(taskId)) {
      newExpanded.delete(taskId);
    } else {
      newExpanded.add(taskId);
    }
    return { expandedTasks: newExpanded };
  }),
  
  expandAll: (taskIds) => set({ expandedTasks: new Set(taskIds) }),
  collapseAll: () => set({ expandedTasks: new Set() }),
}));

