import { STATUS_CONFIG } from '../../lib/utils';

export function TaskDot({ task, showLabel = false }) {
  const config = STATUS_CONFIG[task.status];
  
  if (showLabel) {
    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.color}`}
      >
        {config.label}
      </span>
    );
  }
  
  return (
    <div
      className="w-2 h-2 rounded-full"
      style={{
        backgroundColor: config.color.split(' ')[1]?.replace('text-', '') || '#6b7280',
      }}
      title={`${task.title} - ${config.label}`}
    />
  );
}

