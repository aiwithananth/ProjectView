import { cn } from '../../lib/utils';

export function Input({ label, type = 'text', className, error, ...props }) {
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      {label && (
        <label className="text-sm font-medium" style={{ color: 'hsl(var(--foreground))' }}>
          {label}
        </label>
      )}
      <input
        type={type}
        className={cn(
          'px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-offset-0',
          error && 'border-red-500'
        )}
        style={!error ? { borderColor: 'hsl(var(--input))', backgroundColor: 'hsl(var(--background))', color: 'hsl(var(--foreground))' } : undefined}
        {...props}
      />
      {error && (
        <span className="text-sm text-red-600">{error}</span>
      )}
    </div>
  );
}

