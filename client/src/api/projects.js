import client from './client';

export const projectsApi = {
  getAll: () => client.get('/projects').then(res => res.data),
  
  getById: (id) => client.get(`/projects/${id}`).then(res => res.data),
  
  getTasks: (projectId) => client.get(`/projects/${projectId}/tasks`).then(res => res.data),
  
  create: (data) => client.post('/projects', data).then(res => res.data),
  
  update: (id, data) => client.patch(`/projects/${id}`, data).then(res => res.data),
  
  delete: (id) => client.delete(`/projects/${id}`),
  
  addMember: (projectId, data) => client.post(`/projects/${projectId}/members`, data).then(res => res.data),
  
  removeMember: (projectId, memberId) => client.delete(`/projects/${projectId}/members/${memberId}`),
};

