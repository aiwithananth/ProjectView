import { useState, useMemo } from 'react';
import { Calendar as BigCalendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay, startOfMonth, endOfMonth, startOfDay, addDays, isBefore } from 'date-fns';
import enUS from 'date-fns/locale/en-US';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useCalendarTasks } from '../../hooks/useDashboard';
import { TaskDot } from './TaskDot';
import { getTaskColorIndex } from '../../context/ThemeContext';

const locales = {
  'en-US': enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

export function CalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  
  const from = startOfMonth(currentDate);
  const to = endOfMonth(currentDate);
  
  const { data: tasks, isLoading } = useCalendarTasks(
    from.toISOString(),
    to.toISOString()
  );
  
  // Convert tasks to calendar events (start date → end date)
  const events = useMemo(() => {
    if (!tasks) return [];
    
    return tasks
      .filter(task => task.dueDate)
      .map(task => {
        const end = startOfDay(new Date(task.dueDate));
        const start = task.startDate
          ? startOfDay(new Date(task.startDate))
          : end;
        return {
          id: task.id,
          title: task.title,
          start: start > end ? end : start,
          end: end,
          resource: task,
        };
      });
  }, [tasks]);
  
  // Group tasks by date (each day from start to due)
  const tasksByDate = useMemo(() => {
    if (!tasks) return {};
    
    const grouped = {};
    tasks.forEach(task => {
      if (!task.dueDate) return;
      const due = startOfDay(new Date(task.dueDate));
      const start = task.startDate
        ? startOfDay(new Date(task.startDate))
        : due;
      const rangeStart = start > due ? due : start;
      let d = rangeStart;
      while (!isBefore(due, d)) {
        const dateKey = format(d, 'yyyy-MM-dd');
        if (!grouped[dateKey]) grouped[dateKey] = [];
        grouped[dateKey].push(task);
        d = addDays(d, 1);
      }
    });
    return grouped;
  }, [tasks]);
  
  const handleSelectSlot = ({ start }) => {
    setSelectedDate(start);
  };
  
  const handleNavigate = (date) => {
    setCurrentDate(date);
  };
  
  const eventStyleForTask = (task, index = 0) => {
    const i = (getTaskColorIndex(task, index) % 6) + 1;
    return {
      backgroundColor: `hsl(var(--task-${i}))`,
      color: `hsl(var(--task-${i}-text))`,
    };
  };

  const EventComponent = ({ event }) => {
    const task = event.resource;
    return (
      <div
        className="text-xs px-1 py-0.5 rounded truncate font-medium"
        style={eventStyleForTask(task)}
        title={task.title}
      >
        {task.title}
      </div>
    );
  };
  
  const DayComponent = ({ date }) => {
    const dateKey = format(date, 'yyyy-MM-dd');
    const dayTasks = tasksByDate[dateKey] || [];
    
    if (dayTasks.length === 0) return null;
    
    return (
      <div className="flex gap-1 mt-1 flex-wrap">
        {dayTasks.slice(0, 3).map(task => (
          <TaskDot key={task.id} task={task} />
        ))}
        {dayTasks.length > 3 && (
          <span className="text-xs" style={{ color: 'hsl(var(--muted-foreground))' }}>+{dayTasks.length - 3}</span>
        )}
      </div>
    );
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96" style={{ color: 'hsl(var(--muted-foreground))' }}>
        Loading calendar...
      </div>
    );
  }
  
  return (
    <div className="rounded-lg shadow overflow-hidden border p-6" style={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}>
      <div className="h-[600px]">
        <BigCalendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          onNavigate={handleNavigate}
          onSelectSlot={handleSelectSlot}
          selectable
          components={{
            event: EventComponent,
          }}
          views={['month', 'week', 'day']}
          defaultView="day"
        />
      </div>
      
      {/* Selected date panel */}
      {selectedDate && (
        <div className="mt-6 p-4 rounded-lg" style={{ backgroundColor: 'hsl(var(--muted))' }}>
          <h3 className="font-semibold mb-3" style={{ color: 'hsl(var(--foreground))' }}>
            Tasks for {format(selectedDate, 'MMMM d, yyyy')}
          </h3>
          {(() => {
            const dateKey = format(selectedDate, 'yyyy-MM-dd');
            const dayTasks = tasksByDate[dateKey] || [];
            
            if (dayTasks.length === 0) {
              return <p style={{ color: 'hsl(var(--muted-foreground))' }}>No tasks scheduled for this day</p>;
            }
            return (
              <div className="space-y-2">
                {dayTasks.map(task => (
                  <div
                    key={task.id}
                    className="flex items-center justify-between p-3 rounded-md border"
                    style={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}
                  >
                    <div className="flex-1">
                      <div className="font-medium" style={{ color: 'hsl(var(--foreground))' }}>{task.title}</div>
                      <div className="text-sm" style={{ color: 'hsl(var(--muted-foreground))' }}>{task.project?.name}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <TaskDot task={task} showLabel />
                    </div>
                  </div>
                ))}
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}

