import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

export type ThemeMode = 'light' | 'dark';

export interface ThemeColors {
  primary: string;
  primaryLight: string;
  primaryDark: string;
  secondary: string;
  accent: string;
  accentLight: string;
  accentDark: string;
}

export interface ThemeTypography {
  headingFont: string;
  bodyFont: string;
}

export interface ThemeConfig {
  mode: ThemeMode;
  colors: ThemeColors;
  typography: ThemeTypography;
  borderRadius: string;
  logoUrl: string;
  faviconUrl: string;
}

const defaultTheme: ThemeConfig = {
  mode: 'light',
  colors: {
    primary: '#1e3559',
    primaryLight: '#3a5f8a',
    primaryDark: '#0d1a30',
    secondary: '#ffffff',
    accent: '#c08a2e',
    accentLight: '#d4a347',
    accentDark: '#7e5420',
  },
  typography: {
    headingFont: 'Playfair Display, serif',
    bodyFont: 'Inter, sans-serif',
  },
  borderRadius: '0.75rem',
  logoUrl: '/favicon.svg',
  faviconUrl: '/favicon.svg',
};

interface ThemeContextValue {
  theme: ThemeConfig;
  toggleMode: () => void;
  setMode: (mode: ThemeMode) => void;
  updateTheme: (partial: Partial<ThemeConfig>) => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const STORAGE_KEY = 'evercrest-theme';

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<ThemeConfig>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) return { ...defaultTheme, ...JSON.parse(stored) };
    } catch {
      // ignore
    }
    return defaultTheme;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme.mode === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    root.style.setProperty('--color-primary', theme.colors.primary);
    root.style.setProperty('--color-primary-light', theme.colors.primaryLight);
    root.style.setProperty('--color-primary-dark', theme.colors.primaryDark);
    root.style.setProperty('--color-accent', theme.colors.accent);
    root.style.setProperty('--color-accent-light', theme.colors.accentLight);
    root.style.setProperty('--color-accent-dark', theme.colors.accentDark);
    root.style.setProperty('--font-heading', theme.typography.headingFont);
    root.style.setProperty('--font-body', theme.typography.bodyFont);
    root.style.setProperty('--radius', theme.borderRadius);

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(theme));
    } catch {
      // ignore
    }
  }, [theme]);

  const toggleMode = () => {
    setTheme((prev) => ({ ...prev, mode: prev.mode === 'light' ? 'dark' : 'light' }));
  };

  const setMode = (mode: ThemeMode) => {
    setTheme((prev) => ({ ...prev, mode }));
  };

  const updateTheme = (partial: Partial<ThemeConfig>) => {
    setTheme((prev) => ({ ...prev, ...partial }));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleMode, setMode, updateTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
}
