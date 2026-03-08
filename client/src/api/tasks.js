import client from './client';

export const tasksApi = {
  getById: (id) => client.get(`/tasks/${id}`).then(res => res.data),
  
  create: (data) => client.post('/tasks', data).then(res => res.data),
  
  update: (id, data) => client.patch(`/tasks/${id}`, data).then(res => res.data),
  
  reorder: (id, data) => client.patch(`/tasks/${id}/reorder`, data).then(res => res.data),
  
  delete: (id) => client.delete(`/tasks/${id}`),
};

