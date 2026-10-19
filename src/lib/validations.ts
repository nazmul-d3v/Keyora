import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const testResultSchema = z.object({
  wpm: z.number().nonnegative(),
  rawWpm: z.number().nonnegative(),
  accuracy: z.number().min(0).max(100),
  consistency: z.number().min(0).max(100).default(100),
  duration: z.number().positive(),
  mode: z.enum(['time', 'words', 'quote', 'custom']),
  language: z.enum(['english', 'code', 'quotes', 'numbers', 'spanish']),
  difficulty: z.enum(['easy', 'medium', 'hard']).default('medium'),
  wordsCount: z.number().default(0),
  errorsCount: z.number().default(0),
  charCount: z.number().default(0),
  passageId: z.string().nullable().optional(),
  timelineJson: z.string().nullable().optional(),
});

export const profileUpdateSchema = z.object({
  name: z.string().min(2).max(50).optional(),
  bio: z.string().max(250).optional(),
  image: z.string().max(500, 'Image URL too long (max 500 characters)').optional().nullable(),
  theme: z.string().optional(),
  keyboardLayout: z.string().optional(),
  soundEnabled: z.boolean().optional(),
  soundType: z.enum(['cherry-blue', 'cherry-brown', 'cherry-red', 'topre', 'typewriter']).optional(),
  soundVolume: z.number().min(0).max(1).optional(),
  caretStyle: z.enum(['smooth-line', 'block', 'underline', 'pulse']).optional(),
});
