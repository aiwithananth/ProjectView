import client from './client';

export const exportApi = {
  /** Get all projects with nested tasks (for CSV export). */
  getExportData: () => client.get('/export').then((res) => res.data),
};
