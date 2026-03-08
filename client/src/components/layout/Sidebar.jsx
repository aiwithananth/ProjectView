import { NavLink } from 'react-router-dom';
import { FolderKanban, LayoutDashboard, Calendar, Users, Tag } from 'lucide-react';
import { cn } from '../../lib/utils';

export function Sidebar() {
  const navItems = [
    { to: '/', icon: FolderKanban, label: 'Projects' },
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/calendar', icon: Calendar, label: 'Calendar' },
    { to: '/users', icon: Users, label: 'Users' },
    { to: '/tags', icon: Tag, label: 'Tags' },
  ];
  
  return (
    <aside
      className="w-64 flex flex-col border-r"
      style={{
        backgroundColor: 'hsl(var(--card))',
        borderColor: 'hsl(var(--border))',
      }}
    >
      <div className="px-6 py-6 border-b" style={{ borderColor: 'hsl(var(--border))' }}>
        <h1 className="text-2xl font-bold" style={{ color: 'hsl(var(--primary))' }}>TaskTracker</h1>
        <p className="text-sm mt-1" style={{ color: 'hsl(var(--muted-foreground))' }}>Project Management</p>
      </div>
      <nav className="flex-1 px-4 py-6 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                isActive ? 'bg-primary/10 text-primary font-medium' : 'text-foreground hover:bg-muted'
              )
            }
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="px-6 py-4 border-t space-y-2" style={{ borderColor: 'hsl(var(--border))' }}>
        <p className="text-xs" style={{ color: 'hsl(var(--muted-foreground))' }}>
          Designed and developed by Anantharaman Krishnamoorthy (Ananth). Reach me at{' '}
          <a href="mailto:aiwithananth@gmail.com" className="underline hover:opacity-80" style={{ color: 'hsl(var(--primary))' }}>aiwithananth@gmail.com</a>
          . MIT License.
        </p>
      </div>
    </aside>
  );
}

