import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { checklistsApi } from '../api/checklists';

export function useProjectChecklists(projectId) {
  return useQuery({
    queryKey: ['checklists', 'project', projectId],
    queryFn: () => checklistsApi.getByProject(projectId),
    enabled: !!projectId,
  });
}

export function useChecklist(id) {
  return useQuery({
    queryKey: ['checklists', id],
    queryFn: () => checklistsApi.getById(id),
    enabled: !!id,
  });
}

export function useCreateChecklist() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: checklistsApi.create,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['checklists', 'project', data.projectId] });
    },
  });
}

export function useUpdateChecklist() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }) => checklistsApi.update(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['checklists', data.id] });
      queryClient.invalidateQueries({ queryKey: ['checklists', 'project', data.projectId] });
    },
  });
}

export function useDeleteChecklist() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: checklistsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['checklists'] });
    },
  });
}

export function useAddChecklistItem() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ checklistId, data }) => checklistsApi.addItem(checklistId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['checklists', variables.checklistId] });
      queryClient.invalidateQueries({ queryKey: ['checklists', 'project'] });
    },
  });
}

export function useUpdateChecklistItem() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ itemId, data }) => checklistsApi.updateItem(itemId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['checklists'] });
    },
  });
}

export function useDeleteChecklistItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: checklistsApi.deleteItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['checklists'] });
    },
  });
}

export function useChecklistItemComments(itemId) {
  return useQuery({
    queryKey: ['checklists', 'items', itemId, 'comments'],
    queryFn: () => checklistsApi.getItemComments(itemId),
    enabled: !!itemId,
  });
}

export function useAddChecklistItemComment(itemId) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => checklistsApi.addItemComment(itemId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['checklists', 'items', itemId, 'comments'] });
      queryClient.invalidateQueries({ queryKey: ['checklists', 'project'] });
    },
  });
}

