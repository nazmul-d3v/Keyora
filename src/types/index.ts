export type TypingMode = 'time' | 'words' | 'quote' | 'custom';

export type DurationOption = 15 | 30 | 60 | 120;

export type WordCountOption = 10 | 25 | 50 | 100;

export type LanguageOption = 'english' | 'code' | 'quotes' | 'numbers' | 'spanish';

export type DifficultyOption = 'easy' | 'medium' | 'hard';

export type CharacterState = 'idle' | 'correct' | 'incorrect' | 'extra' | 'missed';

export type TestState = 'idle' | 'running' | 'paused' | 'completed';

export interface TimelinePoint {
  second: number;
  wpm: number;
  rawWpm: number;
  errors: number;
}

export interface TypingStats {
  wpm: number;
  rawWpm: number;
  accuracy: number;
  consistency: number;
  totalChars: number;
  correctChars: number;
  incorrectChars: number;
  extraChars: number;
  missedChars: number;
  elapsedTime: number;
  duration: number;
  wordsCount: number;
  timeline: TimelinePoint[];
}

export interface Passage {
  id: string;
  title: string;
  content: string;
  language: LanguageOption;
  difficulty: DifficultyOption;
  category: string;
  source?: string;
  wordCount: number;
}

export interface TestResult {
  id: string;
  userId?: string | null;
  userName?: string;
  userImage?: string;
  passageId?: string | null;
  wpm: number;
  rawWpm: number;
  accuracy: number;
  consistency: number;
  duration: number;
  mode: TypingMode;
  language: LanguageOption;
  difficulty: DifficultyOption;
  wordsCount: number;
  errorsCount: number;
  charCount: number;
  timelineJson?: string | null;
  createdAt: string | Date;
}

export interface LeaderboardEntry {
  id: string;
  rank?: number;
  userId: string;
  userName: string;
  userImage?: string;
  testResultId: string;
  wpm: number;
  accuracy: number;
  duration: number;
  mode: TypingMode;
  language: LanguageOption;
  createdAt: string | Date;
}

export interface UserProfile {
  id: string;
  name: string;
  email?: string;
  image?: string;
  bio?: string;
  theme: string;
  keyboardLayout: string;
  soundEnabled: boolean;
  soundType: 'cherry-blue' | 'cherry-brown' | 'cherry-red' | 'topre' | 'typewriter';
  soundVolume: number;
  caretStyle: 'smooth-line' | 'block' | 'underline' | 'pulse';
  bestWpm: number;
  avgWpm: number;
  avgAccuracy: number;
  testsCompleted: number;
  totalTimeTyped: number;
  createdAt: string | Date;
}

export interface ThemeOption {
  id: string;
  name: string;
  description: string;
  colors: {
    bg: string;
    surface: string;
    border: string;
    primary: string;
    accent: string;
    text: string;
    muted: string;
    cursor: string;
    correct: string;
    error: string;
  };
}

declare module 'next-auth' {
  interface Session {
    user: {
      id?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: string;
    };
  }

  interface User {
    id: string;
    role?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id?: string;
    role?: string;
  }
}
