import client from './client';

export const commentsApi = {
  getByTaskId: (taskId) =>
    client.get(`/tasks/${taskId}/comments`).then((res) => res.data),

  create: (taskId, data) =>
    client.post(`/tasks/${taskId}/comments`, data).then((res) => res.data),
};
