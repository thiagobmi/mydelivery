import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<Theme>('light');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      const storedTheme = localStorage.getItem('mode') as Theme;
      if (storedTheme) {
        setTheme(storedTheme);
      }
    }
  }, [isMounted]);

  useEffect(() => {
    if (isMounted) {
      if (theme === 'light') {
        document.body.classList.add('lightcolors');
        document.documentElement.classList.remove('dark');
        document.getElementById('visual-toggle-button')?.classList.add('lightmode');
      } else {
        document.body.classList.remove('lightcolors');
        document.documentElement.classList.add('dark');
        document.getElementById('visual-toggle-button')?.classList.remove('lightmode');
      }
      localStorage.setItem('mode', theme);
    }
  }, [theme, isMounted]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
