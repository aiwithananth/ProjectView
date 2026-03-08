import { create } from 'zustand';

export const useProjectStore = create((set) => ({
  selectedProjectId: null,
  setSelectedProjectId: (id) => set({ selectedProjectId: id }),
  
  collapsedProjects: new Set(),
  toggleProjectCollapse: (projectId) => set((state) => {
    const newCollapsed = new Set(state.collapsedProjects);
    if (newCollapsed.has(projectId)) {
      newCollapsed.delete(projectId);
    } else {
      newCollapsed.add(projectId);
    }
    return { collapsedProjects: newCollapsed };
  }),
}));

