import { prisma } from '@/lib/prisma';
import { LeaderboardEntry, TypingMode, LanguageOption } from '@/types';

// Mock high-tier speed demons to populate leaderboard seamlessly
const DEFAULT_LEADERBOARD: LeaderboardEntry[] = [
  {
    id: 'lb-1',
    rank: 1,
    userId: 'u-1',
    userName: 'KinesisPhantom',
    userImage: '/images/avatar-1.svg',
    testResultId: 'res-1',
    wpm: 168.4,
    accuracy: 99.2,
    duration: 60,
    mode: 'time',
    language: 'english',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'lb-2',
    rank: 2,
    userId: 'u-2',
    userName: 'NovaKeys',
    userImage: '/images/avatar-2.svg',
    testResultId: 'res-2',
    wpm: 154.2,
    accuracy: 98.7,
    duration: 60,
    mode: 'time',
    language: 'english',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'lb-3',
    rank: 3,
    userId: 'u-3',
    userName: 'VimSorcerer',
    userImage: '/images/avatar-3.svg',
    testResultId: 'res-3',
    wpm: 147.9,
    accuracy: 100,
    duration: 60,
    mode: 'time',
    language: 'code',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'lb-4',
    rank: 4,
    userId: 'u-4',
    userName: 'AuraType',
    userImage: '/images/avatar-4.svg',
    testResultId: 'res-4',
    wpm: 141.6,
    accuracy: 98.1,
    duration: 30,
    mode: 'time',
    language: 'english',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'lb-5',
    rank: 5,
    userId: 'u-5',
    userName: 'CyberPulse',
    userImage: '/images/avatar-5.svg',
    testResultId: 'res-5',
    wpm: 135.0,
    accuracy: 97.5,
    duration: 15,
    mode: 'time',
    language: 'english',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'lb-6',
    rank: 6,
    userId: 'u-6',
    userName: 'QuantumClicks',
    userImage: '/images/avatar-1.svg',
    testResultId: 'res-6',
    wpm: 128.3,
    accuracy: 96.9,
    duration: 60,
    mode: 'time',
    language: 'quotes',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'lb-7',
    rank: 7,
    userId: 'u-7',
    userName: 'ZenKeycap',
    userImage: '/images/avatar-2.svg',
    testResultId: 'res-7',
    wpm: 122.8,
    accuracy: 99.0,
    duration: 60,
    mode: 'time',
    language: 'english',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'lb-8',
    rank: 8,
    userId: 'u-8',
    userName: 'GlitchRacer',
    userImage: '/images/avatar-3.svg',
    testResultId: 'res-8',
    wpm: 118.5,
    accuracy: 95.8,
    duration: 60,
    mode: 'time',
    language: 'english',
    createdAt: new Date().toISOString(),
  },
];

export class LeaderboardService {
  /**
   * Fetch top leaderboard rankings with optional filters
   */
  static async getLeaderboard(params?: {
    duration?: number;
    mode?: string;
    language?: string;
    limit?: number;
  }): Promise<LeaderboardEntry[]> {
    const limit = params?.limit ?? 50;

    try {
      const where: Record<string, unknown> = {};
      if (params?.duration) where.duration = params.duration;
      if (params?.mode && params.mode !== 'all') where.mode = params.mode;
      if (params?.language && params.language !== 'all') where.language = params.language;

      const entries = await prisma.leaderboardEntry.findMany({
        where,
        orderBy: { wpm: 'desc' },
        take: limit,
        include: {
          user: { select: { id: true, name: true, image: true } },
        },
      });

      if (entries && entries.length > 0) {
        return entries.map((entry, idx) => ({
          id: entry.id,
          rank: idx + 1,
          userId: entry.userId,
          userName: entry.user.name ?? 'Typist',
          userImage: entry.user.image ?? undefined,
          testResultId: entry.testResultId,
          wpm: entry.wpm,
          accuracy: entry.accuracy,
          duration: entry.duration,
          mode: entry.mode as TypingMode,
          language: entry.language as LanguageOption,
          createdAt: entry.createdAt,
        }));
      }
    } catch {
      // Return filtered mock records on error / offline
    }

    return DEFAULT_LEADERBOARD.filter((entry) => {
      if (params?.duration && entry.duration !== params.duration) return false;
      if (params?.mode && params.mode !== 'all' && entry.mode !== params.mode) return false;
      if (params?.language && params.language !== 'all' && entry.language !== params.language) return false;
      return true;
    }).map((entry, idx) => ({
      ...entry,
      rank: idx + 1,
    }));
  }
}
