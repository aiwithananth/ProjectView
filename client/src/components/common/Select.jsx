import { cn } from '../../lib/utils';

export function Select({ label, value, onChange, options, placeholder, className, ...props }) {
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      {label && (
        <label className="text-sm font-medium" style={{ color: 'hsl(var(--foreground))' }}>
          {label}
        </label>
      )}
      <select
        value={value || ''}
        onChange={(e) => onChange(e.target.value || null)}
        className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-offset-0"
        style={{ borderColor: 'hsl(var(--input))', backgroundColor: 'hsl(var(--background))', color: 'hsl(var(--foreground))' }}
        {...props}
      >
        {placeholder && (
          <option value="">{placeholder}</option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

