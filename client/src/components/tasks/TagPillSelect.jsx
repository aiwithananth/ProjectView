import { useState, useRef, useEffect } from 'react';
import { ChevronDown, X, Plus } from 'lucide-react';
import { useTags, useCreateTag } from '../../hooks/useTags';
import { cn } from '../../lib/utils';

export function TagPillSelect({ value = [], onChange, label = 'Tags' }) {
  const { data: tags } = useTags();
  const createTag = useCreateTag();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [newTagName, setNewTagName] = useState('');
  const inputRef = useRef(null);

  const selectedTags = tags?.filter((t) => value.includes(t.id)) ?? [];
  const filtered = tags?.filter(
    (t) =>
      !search ||
      t.name.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  const toggle = (tag) => {
    if (value.includes(tag.id)) {
      onChange(value.filter((id) => id !== tag.id));
    } else {
      onChange([...value, tag.id]);
    }
  };

  const handleCreate = async (e) => {
    e?.preventDefault?.();
    const name = newTagName.trim();
    if (!name) return;
    try {
      const created = await createTag.mutateAsync({ name });
      if (created?.id) {
        onChange([...value, created.id]);
        setNewTagName('');
        setOpen(false);
      }
    } catch (err) {
      console.error('Failed to add tag:', err);
    }
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
          {selectedTags.length > 0 ? (
            selectedTags.map((tag) => (
              <span
                key={tag.id}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border"
                style={{
                  backgroundColor: `${tag.color}20`,
                  borderColor: `${tag.color}40`,
                  color: tag.color,
                }}
              >
                {tag.name}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onChange(value.filter((id) => id !== tag.id));
                  }}
                  className="hover:opacity-70"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))
          ) : null}
          <span className="text-sm" style={{ color: selectedTags.length === 0 ? 'hsl(var(--muted-foreground))' : 'transparent' }}>
            {selectedTags.length === 0 ? 'Select tags...' : ''}
          </span>
          <ChevronDown className="w-4 h-4 ml-auto" style={{ color: 'hsl(var(--muted-foreground))' }} />
        </div>

        {open && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setOpen(false)}
              aria-hidden
            />
            <div className="absolute top-full left-0 right-0 mt-1 border rounded-md shadow-lg z-20 py-1 max-h-60 overflow-auto" style={{ backgroundColor: 'hsl(var(--popover))', borderColor: 'hsl(var(--border))' }}>
              <input
                ref={inputRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search tags..."
                className="w-full px-3 py-2 border-b text-sm focus:outline-none"
                style={{ borderColor: 'hsl(var(--border))', backgroundColor: 'transparent', color: 'hsl(var(--foreground))' }}
              />
              {filtered?.map((tag) => (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => toggle(tag)}
                  className="w-full px-3 py-2 text-left text-sm flex items-center gap-2 hover:opacity-90"
                  style={value.includes(tag.id) ? { backgroundColor: 'hsl(var(--accent))', color: 'hsl(var(--accent-foreground))' } : {}}
                >
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: tag.color }}
                  />
                  {tag.name}
                </button>
              ))}
              <div className="p-2 border-t flex gap-2" style={{ borderColor: 'hsl(var(--border))' }}>
                <input
                  type="text"
                  value={newTagName}
                  onChange={(e) => setNewTagName(e.target.value)}
                  onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  e.stopPropagation();
                  handleCreate(e);
                }
              }}
                  placeholder="New tag name"
                  className="flex-1 px-2 py-1.5 border rounded text-sm focus:outline-none focus:ring-1 focus:ring-offset-0"
                  style={{ borderColor: 'hsl(var(--input))', backgroundColor: 'hsl(var(--background))', color: 'hsl(var(--foreground))' }}
                />
                <button
                  type="button"
                  onClick={handleCreate}
                  disabled={!newTagName.trim() || createTag.isPending}
                  className="inline-flex items-center gap-1 px-2 py-1.5 text-sm rounded disabled:opacity-50"
                  style={{ backgroundColor: 'hsl(var(--primary))', color: 'hsl(var(--primary-foreground))' }}
                >
                  <Plus className="w-4 h-4" />
                  Add
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
