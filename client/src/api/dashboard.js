import client from './client';

export const dashboardApi = {
  getProjectSummary: () => client.get('/dashboard/project-summary').then(res => res.data),
  
  getDayProgress: (days = 30) => client.get(`/dashboard/day-progress?days=${days}`).then(res => res.data),
  
  getBlockers: () => client.get('/dashboard/blockers').then(res => res.data),
  
  getPending: () => client.get('/dashboard/pending').then(res => res.data),
  
  getCalendar: (from, to) => {
    const params = new URLSearchParams();
    if (from) params.append('from', from);
    if (to) params.append('to', to);
    return client.get(`/dashboard/calendar?${params.toString()}`).then(res => res.data);
  },
  
  getStats: () => client.get('/dashboard/stats').then(res => res.data),
};

