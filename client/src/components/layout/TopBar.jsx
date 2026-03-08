import { useState } from 'react';
import { Bell, Settings, Palette, LogOut } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { cn } from '../../lib/utils';

const THEME_LABELS = { light: 'Light', dark: 'Dark', contrast: 'Contrast', blue: 'Blue' };

export function TopBar() {
  const { theme, setTheme, themes } = useTheme();
  const { user, logout } = useAuth();
  const [themeOpen, setThemeOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  return (
    <header
      className="h-16 flex items-center justify-between px-6 border-b transition-colors"
      style={{
        backgroundColor: 'hsl(var(--card))',
        borderColor: 'hsl(var(--border))',
      }}
    >
      <div className="flex-1" />
      <div className="flex items-center gap-4">
        {/* Theme */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setThemeOpen((o) => !o)}
            className="p-2 rounded-lg transition-colors flex items-center gap-2"
            style={{ color: 'hsl(var(--foreground))' }}
            title="Theme"
          >
            <Palette className="w-5 h-5" />
            <span className="text-sm font-medium hidden sm:inline">{THEME_LABELS[theme]}</span>
          </button>
          {themeOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setThemeOpen(false)} aria-hidden />
              <div
                className="absolute right-0 mt-1 py-1 rounded-md shadow-lg border z-20 min-w-[120px]"
                style={{
                  backgroundColor: 'hsl(var(--popover))',
                  borderColor: 'hsl(var(--border))',
                }}
              >
                {themes.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => {
                      setTheme(t);
                      setThemeOpen(false);
                    }}
                    className={cn(
                      'w-full px-4 py-2 text-left text-sm capitalize',
                      theme === t && 'font-medium'
                    )}
                    style={{
                      color: theme === t ? 'hsl(var(--primary))' : 'hsl(var(--foreground))',
                    }}
                  >
                    {THEME_LABELS[t]}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
        <button
          type="button"
          className="p-2 rounded-lg transition-colors relative"
          style={{ color: 'hsl(var(--muted-foreground))' }}
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
        </button>
        <button
          type="button"
          className="p-2 rounded-lg transition-colors"
          style={{ color: 'hsl(var(--muted-foreground))' }}
        >
          <Settings className="w-5 h-5" />
        </button>
        <div className="relative pl-4 border-l" style={{ borderColor: 'hsl(var(--border))' }}>
          <button
            type="button"
            onClick={() => setUserMenuOpen((o) => !o)}
            className="flex items-center gap-3 rounded-lg p-1 pr-2 hover:opacity-90"
          >
            {user?.avatar ? (
              <img src={user.avatar} alt="" className="w-8 h-8 rounded-full object-cover" />
            ) : (
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium"
                style={{ backgroundColor: 'hsl(var(--primary))', color: 'hsl(var(--primary-foreground))' }}
              >
                {(user?.name || 'U').charAt(0).toUpperCase()}
              </div>
            )}
            <div className="text-left text-sm hidden sm:block">
              <div className="font-medium" style={{ color: 'hsl(var(--foreground))' }}>{user?.name || 'User'}</div>
              <div className="text-xs truncate max-w-[140px]" style={{ color: 'hsl(var(--muted-foreground))' }}>{user?.email || ''}</div>
            </div>
          </button>
          {userMenuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setUserMenuOpen(false)} aria-hidden />
              <div
                className="absolute right-0 mt-1 py-1 rounded-md shadow-lg border z-20 min-w-[160px]"
                style={{ backgroundColor: 'hsl(var(--popover))', borderColor: 'hsl(var(--border))' }}
              >
                <button
                  type="button"
                  onClick={() => { logout(); setUserMenuOpen(false); }}
                  className="w-full px-4 py-2 text-left text-sm flex items-center gap-2 hover:opacity-90"
                  style={{ color: 'hsl(var(--foreground))' }}
                >
                  <LogOut className="w-4 h-4" />
                  Log out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

