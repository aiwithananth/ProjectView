import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { commentsApi } from '../api/comments';

export function useTaskComments(taskId) {
  return useQuery({
    queryKey: ['tasks', taskId, 'comments'],
    queryFn: () => commentsApi.getByTaskId(taskId),
    enabled: !!taskId,
  });
}

export function useAddComment(taskId) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => commentsApi.create(taskId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', taskId, 'comments'] });
    },
  });
}
