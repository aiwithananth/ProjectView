import { createContext, useContext, useEffect, useState } from 'react';

const STORAGE_KEY = 'tasktracker-theme';
const THEMES = ['light', 'dark', 'contrast', 'blue'];

const ThemeContext = createContext({
  theme: 'light',
  setTheme: () => {},
  themes: THEMES,
});

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) || 'light';
    } catch {
      return 'light';
    }
  });

  const setTheme = (value) => {
    const next = THEMES.includes(value) ? value : 'light';
    setThemeState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch (_) {}
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, themes: THEMES }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}

/** Task/calendar accent index (0..5) for consistent per-task color */
export function getTaskColorIndex(taskOrProject, index = 0) {
  const id = taskOrProject?.id ?? taskOrProject ?? '';
  let n = 0;
  for (let i = 0; i < Math.min(id.length, 8); i++) n += id.charCodeAt(i);
  return (n + index) % 6;
}
