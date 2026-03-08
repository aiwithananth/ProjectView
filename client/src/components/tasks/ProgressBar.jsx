import { cn } from '../../lib/utils';

export function ProgressBar({ value, showLabel = true, size = 'sm' }) {
  const percentage = Math.min(Math.max(value || 0, 0), 100);
  
  const sizes = {
    xs: 'h-1',
    sm: 'h-2',
    md: 'h-3',
  };
  
  const getColor = (val) => {
    if (val === 100) return 'bg-green-500';
    if (val >= 75) return 'bg-blue-500';
    if (val >= 50) return 'bg-yellow-500';
    if (val >= 25) return 'bg-orange-500';
    return 'bg-gray-400';
  };
  
  return (
    <div className="flex items-center gap-2 min-w-[100px]">
      <div className={cn('flex-1 rounded-full overflow-hidden', sizes[size])} style={{ backgroundColor: 'hsl(var(--muted))' }}>
        <div
          className={cn('h-full transition-all duration-300', getColor(percentage))}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-xs font-medium min-w-[35px]" style={{ color: 'hsl(var(--foreground))' }}>
          {percentage}%
        </span>
      )}
    </div>
  );
}

