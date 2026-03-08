import { useState, useRef, useEffect } from 'react';
import { ChevronDown, X } from 'lucide-react';
import { useUsers } from '../../hooks/useUsers';
import { AddUserModal } from '../common/AddUserModal';
import { cn } from '../../lib/utils';

export function OwnerPillSelect({ value, onChange, label = 'Owner' }) {
  const { data: users } = useUsers();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [addUserOpen, setAddUserOpen] = useState(false);
  const inputRef = useRef(null);

  const selected = users?.find((u) => u.id === value);
  const filtered = users?.filter(
    (u) =>
      !search ||
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (search.trim()) {
        const match = filtered?.find(
          (u) =>
            u.name.toLowerCase() === search.trim().toLowerCase() ||
            u.email.toLowerCase() === search.trim().toLowerCase()
        );
        if (match) {
          onChange(match.id);
          setSearch('');
          setOpen(false);
        } else {
          setAddUserOpen(true);
        }
      }
    }
    if (e.key === 'Escape') setOpen(false);
  };

  const handleSelect = (user) => {
    onChange(user.id);
    setSearch('');
    setOpen(false);
  };

  const handleCreated = (user) => {
    onChange(user.id);
    setOpen(false);
  };

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm font-medium" style={{ color: 'hsl(var(--foreground))' }}>{label}</label>
      )}
      <div className="relative">
        <div
          className="min-h-[42px] px-3 py-2 border rounded-md flex flex-wrap items-center gap-2 cursor-pointer focus-within:ring-2 focus-within:ring-offset-0"
          style={{ borderColor: 'hsl(var(--input))' }}
          onClick={() => setOpen(true)}
        >
          {selected ? (
            <span
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-sm font-medium"
              style={{ backgroundColor: 'hsl(var(--primary) / 0.15)', color: 'hsl(var(--primary))' }}
            >
              {selected.avatar ? (
                <img src={selected.avatar} alt="" className="w-5 h-5 rounded-full object-cover shrink-0" />
              ) : (
                <span
                  className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-semibold shrink-0"
                  style={{ backgroundColor: 'hsl(var(--primary) / 0.3)', color: 'hsl(var(--primary))' }}
                >
                  {(selected.name || '?').charAt(0).toUpperCase()}
                </span>
              )}
              {selected.name}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onChange(null);
                }}
                className="rounded-full p-0.5 opacity-70 hover:opacity-100"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ) : (
            <span className="text-sm" style={{ color: 'hsl(var(--muted-foreground))' }}>Select owner...</span>
          )}
          <ChevronDown className="w-4 h-4 ml-auto shrink-0" style={{ color: 'hsl(var(--muted-foreground))' }} />
        </div>

        {open && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setOpen(false)}
              aria-hidden
            />
            <div
              className="absolute top-full left-0 right-0 mt-1 border rounded-md shadow-lg z-20 py-1 max-h-60 overflow-auto"
              style={{ backgroundColor: 'hsl(var(--popover))', borderColor: 'hsl(var(--border))', color: 'hsl(var(--popover-foreground))' }}
            >
              <input
                ref={inputRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search or type name and press Enter to add..."
                className="w-full px-3 py-2 border-b text-sm focus:outline-none"
                style={{ borderColor: 'hsl(var(--border))', backgroundColor: 'transparent', color: 'hsl(var(--foreground))' }}
              />
              {filtered?.map((user) => (
                <button
                  key={user.id}
                  type="button"
                  onClick={() => handleSelect(user)}
                  className="w-full px-3 py-2 text-left text-sm flex items-center gap-2 hover:opacity-90"
                  style={value === user.id ? { backgroundColor: 'hsl(var(--accent))', color: 'hsl(var(--accent-foreground))' } : {}}
                >
                  {user.avatar ? (
                    <img src={user.avatar} alt="" className="w-6 h-6 rounded-full object-cover shrink-0" />
                  ) : (
                    <span
                      className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium shrink-0"
                      style={{ backgroundColor: 'hsl(var(--primary) / 0.2)', color: 'hsl(var(--primary))' }}
                    >
                      {(user.name || '?').charAt(0).toUpperCase()}
                    </span>
                  )}
                  {user.name} <span style={{ color: 'hsl(var(--muted-foreground))' }}>{user.email}</span>
                </button>
              ))}
              {search.trim() && !filtered?.length && (
                <button
                  type="button"
                  onClick={() => setAddUserOpen(true)}
                  className="w-full px-3 py-2 text-left text-sm"
                  style={{ color: 'hsl(var(--primary))' }}
                >
                  + Add "{search.trim()}" as new user
                </button>
              )}
            </div>
          </>
        )}
      </div>

      <AddUserModal
        isOpen={addUserOpen}
        onClose={() => setAddUserOpen(false)}
        onCreated={handleCreated}
        initialName={search.trim()}
      />
    </div>
  );
}
