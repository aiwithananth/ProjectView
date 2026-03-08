import { useState, useMemo, Fragment } from 'react';
import { format, addDays, startOfDay, endOfDay, isBefore } from 'date-fns';
import { useCalendarTasks } from '../../hooks/useDashboard';
import { getTaskColorIndex } from '../../context/ThemeContext';
import { cn } from '../../lib/utils';

const TASK_BAR_CLASSES = ['task-bar-1', 'task-bar-2', 'task-bar-3', 'task-bar-4', 'task-bar-5', 'task-bar-6'];

const MS_PER_DAY = 24 * 60 * 60 * 1000;

export function CalendarTimelineView({ mode = 'week' }) {
  // mode: 'day' = 14 days, 'week' = 7 days (same layout, different range)
  const daysShown = mode === 'week' ? 7 : 14;
  const [startDate, setStartDate] = useState(() => startOfDay(new Date()));
  const from = startDate;
  const to = endOfDay(addDays(startDate, daysShown - 1));

  const { data: tasks, isLoading } = useCalendarTasks(
    from.toISOString(),
    to.toISOString()
  );

  const days = useMemo(() => {
    const d = [];
    for (let i = 0; i < daysShown; i++) {
      d.push(addDays(startDate, i));
    }
    return d;
  }, [startDate, daysShown]);

  const today = startOfDay(new Date());
  const rangeStart = startDate.getTime();

  // Group tasks by project
  const byProject = useMemo(() => {
    if (!tasks?.length) return [];
    const map = new Map();
    tasks.forEach((task) => {
      const pid = task.projectId || 'none';
      const name = task.project?.name ?? 'No project';
      if (!map.has(pid)) map.set(pid, { id: pid, name, tasks: [] });
      map.get(pid).tasks.push(task);
    });
    return Array.from(map.values());
  }, [tasks]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12" style={{ color: 'hsl(var(--muted-foreground))' }}>
        Loading timeline...
      </div>
    );
  }

  return (
    <div className="rounded-lg shadow overflow-hidden border" style={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}>
      <div className="flex items-center justify-between px-4 py-2 border-b" style={{ backgroundColor: 'hsl(var(--muted))', borderColor: 'hsl(var(--border))' }}>
        <h3 className="font-semibold" style={{ color: 'hsl(var(--foreground))' }}>
          {mode === 'week' ? 'Week' : 'Day'} view — days on top, projects & tasks on left
        </h3>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setStartDate((d) => addDays(d, -daysShown))}
            className="px-2 py-1 text-sm rounded hover:bg-muted transition-colors"
            style={{ color: 'hsl(var(--foreground))' }}
          >
            ← Prev
          </button>
          <button
            type="button"
            onClick={() => setStartDate(startOfDay(new Date()))}
            className="px-2 py-1 text-sm rounded hover:bg-muted transition-colors"
            style={{ color: 'hsl(var(--foreground))' }}
          >
            Today
          </button>
          <button
            type="button"
            onClick={() => setStartDate((d) => addDays(d, daysShown))}
            className="px-2 py-1 text-sm rounded hover:bg-muted transition-colors"
            style={{ color: 'hsl(var(--foreground))' }}
          >
            Next →
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse" style={{ minWidth: 320 + daysShown * 48 }}>
          <thead>
            <tr className="border-b" style={{ backgroundColor: 'hsl(var(--muted))', borderColor: 'hsl(var(--border))' }}>
              <th className="text-left py-2 px-3 text-xs font-medium uppercase w-56 min-w-[200px] sticky left-0 z-10 border-r" style={{ color: 'hsl(var(--muted-foreground))', backgroundColor: 'hsl(var(--muted))', borderColor: 'hsl(var(--border))' }}>Filter</th>
              <th colSpan={daysShown} className="text-center py-1 text-xs font-medium border-b" style={{ color: 'hsl(var(--foreground))', borderColor: 'hsl(var(--border))' }}>{format(startDate, 'yyyy')}</th>
            </tr>
            <tr className="border-b" style={{ backgroundColor: 'hsl(var(--muted))', borderColor: 'hsl(var(--border))' }}>
              <th className="text-left py-2 px-3 text-xs font-medium uppercase sticky left-0 z-10 border-r" style={{ color: 'hsl(var(--muted-foreground))', backgroundColor: 'hsl(var(--muted))', borderColor: 'hsl(var(--border))' }}>Project / Task</th>
              {days.map((day) => (
                <th key={day.toISOString()} className={cn('py-2 px-0 text-center text-xs font-medium w-12 min-w-[48px]', day.getTime() === today.getTime() && 'bg-primary/15')} style={{ color: day.getTime() === today.getTime() ? 'hsl(var(--primary))' : 'hsl(var(--foreground))' }}>
                  {format(day, 'dd-MMM')}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {byProject.length === 0 && (
              <tr>
                <td colSpan={daysShown + 1} className="py-8 text-center" style={{ color: 'hsl(var(--muted-foreground))' }}>
                  No tasks in this range
                </td>
              </tr>
            )}
            {byProject.map((proj) => (
              <Fragment key={proj.id}>
                <tr className="border-b" style={{ backgroundColor: 'hsl(var(--muted) / 0.5)', borderColor: 'hsl(var(--border))' }}>
                  <td className="py-1 px-3 sticky left-0 z-10 border-r font-medium text-sm" style={{ backgroundColor: 'hsl(var(--muted) / 0.5)', borderColor: 'hsl(var(--border))', color: 'hsl(var(--foreground))' }}>{proj.name}</td>
                  <td colSpan={daysShown} className="p-0" />
                </tr>
                {proj.tasks.map((task, taskIndex) => {
                  const due = task.dueDate ? startOfDay(new Date(task.dueDate)) : null;
                  const start = task.startDate
                    ? startOfDay(new Date(task.startDate))
                    : task.createdAt
                      ? startOfDay(new Date(task.createdAt))
                      : due
                        ? addDays(due, -1)
                        : null;
                  const isOverdue = due && isBefore(due, today);
                  const barClass = TASK_BAR_CLASSES[getTaskColorIndex(task, taskIndex)] || TASK_BAR_CLASSES[0];

                  const rangeStartT = rangeStart;
                  const rangeLen = daysShown * MS_PER_DAY;
                  const barStart = start ? Math.max(0, (start.getTime() - rangeStartT) / rangeLen) : 0;
                  const barDue = due ? Math.min(1, Math.max(0, (due.getTime() - rangeStartT) / rangeLen)) : 0;
                  const barToday = Math.min(1, (today.getTime() - rangeStartT) / rangeLen);
                  const progress = task.progress ?? 0;

                  return (
                    <tr key={task.id} className="border-b hover:opacity-90 transition-opacity" style={{ borderColor: 'hsl(var(--border))' }}>
                      <td className="py-1 px-3 sticky left-0 z-10 border-r" style={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}>
                        <div className="text-sm truncate" style={{ color: 'hsl(var(--foreground))' }}>{task.title}</div>
                      </td>
                      <td colSpan={daysShown} className="p-0.5 align-top">
                        <div className="relative h-6 w-full">
                          {/* Blue bar: start → due */}
                          {due && barDue > barStart && (
                            <div
                              className={cn('absolute top-0.5 h-5 rounded min-w-[2px] flex items-center justify-center text-xs font-medium', barClass)}
                              style={{ left: `${barStart * 100}%`, width: `${(barDue - barStart) * 100}%` }}
                              title={`Due ${format(due, 'MMM d')} · ${progress}%`}
                            >
                              {progress}%
                            </div>
                          )}
                          {isOverdue && barToday > barDue && (
                            <div
                              className="absolute top-0.5 h-5 rounded min-w-[2px] task-bar-overdue"
                              style={{ left: `${barDue * 100}%`, width: `${(barToday - barDue) * 100}%` }}
                              title="Overdue"
                            />
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
