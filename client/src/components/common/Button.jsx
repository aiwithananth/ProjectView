import { cn } from '../../lib/utils';

export function Button({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className, 
  disabled,
  ...props 
}) {
  const baseStyles = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';
  
  const variants = {
    primary: '',
    secondary: 'hover:opacity-90',
    outline: 'border hover:opacity-90',
    ghost: 'hover:opacity-90',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-600',
  };
  const variantStyles = {
    primary: { backgroundColor: 'hsl(var(--primary))', color: 'hsl(var(--primary-foreground))' },
    secondary: { backgroundColor: 'hsl(var(--muted))', color: 'hsl(var(--foreground))' },
    outline: { borderColor: 'hsl(var(--border))', backgroundColor: 'hsl(var(--background))', color: 'hsl(var(--foreground))' },
    ghost: { color: 'hsl(var(--foreground))' },
    danger: {},
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };
  
  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      style={variantStyles[variant]}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}

