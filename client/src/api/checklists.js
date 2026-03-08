import client from './client';

export const checklistsApi = {
  getByProject: (projectId) => client.get(`/checklists/project/${projectId}`).then(res => res.data),
  
  getById: (id) => client.get(`/checklists/${id}`).then(res => res.data),
  
  create: (data) => client.post('/checklists', data).then(res => res.data),
  
  update: (id, data) => client.patch(`/checklists/${id}`, data).then(res => res.data),
  
  delete: (id) => client.delete(`/checklists/${id}`),
  
  addItem: (checklistId, data) => client.post(`/checklists/${checklistId}/items`, data).then(res => res.data),
  
  updateItem: (itemId, data) => client.patch(`/checklists/items/${itemId}`, data).then(res => res.data),

  deleteItem: (itemId) => client.delete(`/checklists/items/${itemId}`),

  getItemComments: (itemId) =>
    client.get(`/checklists/items/${itemId}/comments`).then((res) => res.data),

  addItemComment: (itemId, data) =>
    client.post(`/checklists/items/${itemId}/comments`, data).then((res) => res.data),
};

