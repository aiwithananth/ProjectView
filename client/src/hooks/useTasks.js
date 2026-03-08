import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tasksApi } from '../api/tasks';

export function useTask(id) {
  return useQuery({
    queryKey: ['tasks', id],
    queryFn: () => tasksApi.getById(id),
    enabled: !!id,
  });
}

export function useCreateTask() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: tasksApi.create,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['projects', data.projectId, 'tasks'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}

export function useUpdateTask() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }) => tasksApi.update(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['projects', data.projectId, 'tasks'] });
      queryClient.invalidateQueries({ queryKey: ['tasks', data.id] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}

export function useReorderTask() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }) => tasksApi.reorder(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['projects', data.projectId, 'tasks'] });
    },
  });
}

export function useDeleteTask() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: tasksApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}

