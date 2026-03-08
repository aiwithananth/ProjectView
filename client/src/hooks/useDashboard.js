import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '../api/dashboard';

export function useProjectSummary() {
  return useQuery({
    queryKey: ['dashboard', 'project-summary'],
    queryFn: dashboardApi.getProjectSummary,
  });
}

export function useDayProgress(days = 30) {
  return useQuery({
    queryKey: ['dashboard', 'day-progress', days],
    queryFn: () => dashboardApi.getDayProgress(days),
  });
}

export function useBlockers() {
  return useQuery({
    queryKey: ['dashboard', 'blockers'],
    queryFn: dashboardApi.getBlockers,
  });
}

export function usePending() {
  return useQuery({
    queryKey: ['dashboard', 'pending'],
    queryFn: dashboardApi.getPending,
  });
}

export function useCalendarTasks(from, to) {
  return useQuery({
    queryKey: ['dashboard', 'calendar', from, to],
    queryFn: () => dashboardApi.getCalendar(from, to),
    enabled: !!from && !!to,
  });
}

export function useDashboardStats() {
  return useQuery({
    queryKey: ['dashboard', 'stats'],
    queryFn: dashboardApi.getStats,
  });
}

