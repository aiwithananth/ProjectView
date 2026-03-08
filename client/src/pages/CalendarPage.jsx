import { useState } from 'react';
import { CalendarView } from '../components/calendar/CalendarView';
import { CalendarTimelineView } from '../components/calendar/CalendarTimelineView';

export function CalendarPage() {
  const [view, setView] = useState('timeline'); // 'calendar' | 'timeline'
  const [timelineMode, setTimelineMode] = useState('week'); // 'week' (7 days) | 'day' (14 days)

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: 'hsl(var(--foreground))' }}>Calendar</h1>
          <p className="mt-1" style={{ color: 'hsl(var(--muted-foreground))' }}>Days on top, projects & tasks on left — progress to due and beyond</p>
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          {view === 'timeline' && (
            <>
              <span className="text-sm" style={{ color: 'hsl(var(--muted-foreground))' }}>Range:</span>
              <button
                type="button"
                onClick={() => setTimelineMode('week')}
                className={`px-3 py-1.5 rounded-md text-sm font-medium ${
                  timelineMode === 'week'
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:opacity-90 transition-colors'
                }`}
                style={timelineMode !== 'week' ? { backgroundColor: 'hsl(var(--muted))', color: 'hsl(var(--foreground))' } : undefined}
              >
                Week (7 days)
              </button>
              <button
                type="button"
                onClick={() => setTimelineMode('day')}
                className={`px-3 py-1.5 rounded-md text-sm font-medium ${
                  timelineMode === 'day'
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:opacity-90 transition-colors'
                }`}
                style={timelineMode !== 'day' ? { backgroundColor: 'hsl(var(--muted))', color: 'hsl(var(--foreground))' } : undefined}
              >
                Day (14 days)
              </button>
              <span className="w-px h-6 mx-1" style={{ backgroundColor: 'hsl(var(--border))' }} />
            </>
          )}
          <button
            type="button"
            onClick={() => setView('calendar')}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              view === 'calendar'
                ? 'bg-primary text-primary-foreground'
                : 'hover:opacity-90 transition-colors'
            }`}
            style={view !== 'calendar' ? { backgroundColor: 'hsl(var(--muted))', color: 'hsl(var(--foreground))' } : undefined}
          >
            Month / Week / Day
          </button>
          <button
            type="button"
            onClick={() => setView('timeline')}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              view === 'timeline'
                ? 'bg-primary text-primary-foreground'
                : 'hover:opacity-90 transition-colors'
            }`}
            style={view !== 'timeline' ? { backgroundColor: 'hsl(var(--muted))', color: 'hsl(var(--foreground))' } : undefined}
          >
            Timeline
          </button>
        </div>
      </div>

      {view === 'calendar' && <CalendarView />}
      {view === 'timeline' && <CalendarTimelineView mode={timelineMode} />}
    </div>
  );
}

