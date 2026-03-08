import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';

export function DayProgressChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        No progress data available
      </div>
    );
  }
  
  const chartData = data.map(item => ({
    ...item,
    dateFormatted: format(new Date(item.date), 'MMM dd'),
  }));
  
  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">30-Day Progress</h3>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="dateFormatted" 
            tick={{ fontSize: 12 }}
            interval="preserveStartEnd"
          />
          <YAxis 
            domain={[0, 100]}
            tick={{ fontSize: 12 }}
            label={{ value: 'Completion %', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip 
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload;
                return (
                  <div className="bg-white p-3 border border-gray-200 rounded-md shadow-lg">
                    <p className="font-medium text-gray-900">{data.dateFormatted}</p>
                    <p className="text-sm text-gray-600">
                      Completion: {data.completionRate}%
                    </p>
                    <p className="text-sm text-gray-600">
                      {data.completed} / {data.total} tasks
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Area 
            type="monotone" 
            dataKey="completionRate" 
            stroke="#3b82f6" 
            fillOpacity={1} 
            fill="url(#colorRate)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

