import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

export function DonutChart({ data, title }) {
  const COLORS = {
    done: '#10b981',
    inProgress: '#3b82f6',
    onTrack: '#06b6d4',
    blocked: '#f97316',
    overdue: '#ef4444',
    pending: '#6b7280',
  };
  
  const chartData = [
    { name: 'Done', value: data.done, color: COLORS.done },
    { name: 'In Progress', value: data.inProgress, color: COLORS.inProgress },
    { name: 'On Track', value: data.onTrack, color: COLORS.onTrack },
    { name: 'Blocked', value: data.blocked, color: COLORS.blocked },
    { name: 'Overdue', value: data.overdue, color: COLORS.overdue },
    { name: 'Pending', value: data.pending, color: COLORS.pending },
  ].filter(item => item.value > 0);
  
  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        No data available
      </div>
    );
  }
  
  return (
    <div>
      {title && (
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      )}
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={2}
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
      <div className="text-center mt-4">
        <div className="text-3xl font-bold text-gray-900">{data.completionRate}%</div>
        <div className="text-sm text-gray-500">Completion Rate</div>
      </div>
    </div>
  );
}

