export function OwnerAvatar({ user, size = 'sm', showLabel = true }) {
  if (!user) {
    return (
      <div className="flex items-center gap-2 text-sm" style={{ color: 'hsl(var(--muted-foreground))' }}>
        <div className="w-6 h-6 rounded-full shrink-0" style={{ backgroundColor: 'hsl(var(--muted))' }} />
        {showLabel && <span className="text-xs">Unassigned</span>}
      </div>
    );
  }

  const sizes = {
    xs: 'w-5 h-5',
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
  };

  return (
    <div className="flex items-center gap-2">
      {user.avatar ? (
        <img
          src={user.avatar}
          alt={user.name}
          className={`${sizes[size]} rounded-full object-cover shrink-0`}
        />
      ) : (
        <div
          className={`${sizes[size]} rounded-full flex items-center justify-center text-xs font-medium shrink-0`}
          style={{ backgroundColor: 'hsl(var(--primary) / 0.2)', color: 'hsl(var(--primary))' }}
        >
          {(user.name || '?').charAt(0).toUpperCase()}
        </div>
      )}
      {showLabel && <span className="text-sm" style={{ color: 'hsl(var(--foreground))' }}>{user.name}</span>}
    </div>
  );
}

