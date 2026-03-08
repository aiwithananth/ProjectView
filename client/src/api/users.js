import client from './client';

export const usersApi = {
  getAll: () => client.get('/users').then(res => res.data),
  
  getById: (id) => client.get(`/users/${id}`).then(res => res.data),
  
  create: (data) => client.post('/users', data).then(res => res.data),
  
  update: (id, data) => client.patch(`/users/${id}`, data).then(res => res.data),
  
  delete: (id) => client.delete(`/users/${id}`),
};

