import { useProjectSummary, useDayProgress, useBlockers, usePending, useDashboardStats } from '../hooks/useDashboard';
import { StatsCards } from '../components/dashboard/StatsCards';
import { DonutChart } from '../components/dashboard/DonutChart';
import { DayProgressChart } from '../components/dashboard/DayProgressChart';
import { BlockersTable } from '../components/dashboard/BlockersTable';
import { PendingTable } from '../components/dashboard/PendingTable';

export function DashboardPage() {
  const { data: stats } = useDashboardStats();
  const { data: projectSummary } = useProjectSummary();
  const { data: dayProgress } = useDayProgress();
  const { data: blockers } = useBlockers();
  const { data: pending } = usePending();
  
  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Overview of all projects and tasks</p>
      </div>
      
      {/* Stats Cards */}
      <StatsCards stats={stats} />
      
      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Project Summary Donuts */}
        {projectSummary && projectSummary.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Project Summary</h2>
            <div className="grid grid-cols-1 gap-8">
              {projectSummary.slice(0, 2).map((project) => (
                <DonutChart
                  key={project.projectId}
                  data={project}
                  title={project.projectName}
                />
              ))}
            </div>
          </div>
        )}
        
        {/* Day Progress Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <DayProgressChart data={dayProgress} />
        </div>
      </div>
      
      {/* Tables */}
      <div className="space-y-6">
        {/* Blockers */}
        <div className="bg-white rounded-lg shadow p-6">
          <BlockersTable blockers={blockers} />
        </div>
        
        {/* Pending */}
        <div className="bg-white rounded-lg shadow p-6">
          <PendingTable tasks={pending} />
        </div>
      </div>
    </div>
  );
}

