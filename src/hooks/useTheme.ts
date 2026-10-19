'use client';

import { useState, useEffect } from 'react';
import { ThemeOption } from '@/types';

export const THEMES: ThemeOption[] = [
  {
    id: 'cyber-neon',
    name: 'Cyber Neon',
    description: 'Electric cyan, violet glow & deep space backdrop',
    colors: {
      bg: '#090d16',
      surface: '#111827',
      border: '#1f293d',
      primary: '#38bdf8',
      accent: '#818cf8',
      text: '#f1f5f9',
      muted: '#64748b',
      cursor: '#38bdf8',
      correct: '#38bdf8',
      error: '#f43f5e',
    },
  },
  {
    id: 'nord',
    name: 'Nord Frost',
    description: 'Arctic blue, clean icy mist & minimal contrast',
    colors: {
      bg: '#1e2430',
      surface: '#252d3c',
      border: '#3b4559',
      primary: '#88c0d0',
      accent: '#81a1c1',
      text: '#eceff4',
      muted: '#7b889b',
      cursor: '#88c0d0',
      correct: '#a3be8c',
      error: '#bf616a',
    },
  },
  {
    id: 'dracula',
    name: 'Dracula',
    description: 'Vampiric purple, pink highlights & dark gothic allure',
    colors: {
      bg: '#181924',
      surface: '#212230',
      border: '#393a52',
      primary: '#ff79c6',
      accent: '#bd93f9',
      text: '#f8f8f2',
      muted: '#6272a4',
      cursor: '#50fa7b',
      correct: '#50fa7b',
      error: '#ff5555',
    },
  },
  {
    id: 'sunset',
    name: 'Amber Sunset',
    description: 'Warm gold, deep burnt ember & twilight aesthetics',
    colors: {
      bg: '#120d0e',
      surface: '#1c1517',
      border: '#332328',
      primary: '#f59e0b',
      accent: '#fb923c',
      text: '#fef3c7',
      muted: '#856b72',
      cursor: '#f59e0b',
      correct: '#10b981',
      error: '#ef4444',
    },
  },
  {
    id: 'matrix',
    name: 'Matrix Terminal',
    description: 'CRT phosphor green, hacking pulse & zero latency',
    colors: {
      bg: '#050a05',
      surface: '#0a140a',
      border: '#142a14',
      primary: '#22c55e',
      accent: '#4ade80',
      text: '#86efac',
      muted: '#22552e',
      cursor: '#22c55e',
      correct: '#4ade80',
      error: '#f87171',
    },
  },
];

export function useTheme() {
  const [theme, setTheme] = useState<string>('cyber-neon');

  useEffect(() => {
    const savedTheme = localStorage.getItem('keyora-theme') || 'cyber-neon';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  const changeTheme = (newTheme: string) => {
    setTheme(newTheme);
    localStorage.setItem('keyora-theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const currentThemeConfig = THEMES.find((t) => t.id === theme) || THEMES[0];

  return {
    theme,
    changeTheme,
    themes: THEMES,
    currentThemeConfig,
  };
}
