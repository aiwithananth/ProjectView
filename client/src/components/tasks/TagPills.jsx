import { X } from 'lucide-react';
import { cn } from '../../lib/utils';

export function TagPills({ tags, onRemove, editable = false }) {
  if (!tags || tags.length === 0) return null;
  
  return (
    <div className="flex flex-wrap gap-1">
      {tags.map((tag) => (
        <span
          key={tag.id}
          className={cn(
            'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium',
            'border'
          )}
          style={{
            backgroundColor: `${tag.color}20`,
            borderColor: `${tag.color}40`,
            color: tag.color,
          }}
        >
          {tag.name}
          {editable && onRemove && (
            <button
              onClick={() => onRemove(tag.id)}
              className="hover:opacity-70"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </span>
      ))}
    </div>
  );
}

