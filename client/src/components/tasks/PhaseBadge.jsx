import { PHASE_CONFIG } from '../../lib/utils';
import { cn } from '../../lib/utils';

export function PhaseBadge({ phase, onClick }) {
  if (!phase) return null;
  
  const config = PHASE_CONFIG[phase];
  
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

