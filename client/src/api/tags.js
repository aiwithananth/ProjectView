import client from './client';

export const tagsApi = {
  getAll: () => client.get('/tags').then(res => res.data),
  
  getById: (id) => client.get(`/tags/${id}`).then(res => res.data),
  
  create: (data) => client.post('/tags', data).then(res => res.data),
  
  update: (id, data) => client.patch(`/tags/${id}`, data).then(res => res.data),
  
  delete: (id) => client.delete(`/tags/${id}`),
};

