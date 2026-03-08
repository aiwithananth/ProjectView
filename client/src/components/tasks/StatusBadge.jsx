import { STATUS_CONFIG } from '../../lib/utils';
import { cn } from '../../lib/utils';

export function StatusBadge({ status, onClick }) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.PENDING;
  
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border cursor-pointer hover:opacity-80 transition-opacity',
        config.color
      )}
      onClick={onClick}
    >
      {config.label}
    </span>
  );
}

