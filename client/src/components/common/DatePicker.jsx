import { Calendar } from 'lucide-react';
import { cn } from '../../lib/utils';
import { formatDateInput } from '../../lib/utils';

export function DatePicker({ label, value, onChange, className, ...props }) {
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      {label && (
        <label className="text-sm font-medium" style={{ color: 'hsl(var(--foreground))' }}>
          {label}
        </label>
      )}
      <div className="relative">
        <input
          type="date"
          value={value ? formatDateInput(value) : ''}
          onChange={(e) => onChange(e.target.value || null)}
          className="w-full px-3 py-2 pl-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-offset-0"
          style={{ borderColor: 'hsl(var(--input))', backgroundColor: 'hsl(var(--background))', color: 'hsl(var(--foreground))' }}
          {...props}
        />
        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: 'hsl(var(--muted-foreground))' }} />
      </div>
    </div>
  );
}

