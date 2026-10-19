import { prisma } from '@/lib/prisma';
import { TestResult, TypingMode, LanguageOption, DifficultyOption } from '@/types';
import { generateId } from '@/lib/utils';

export class TestService {
  /**
   * Save a completed test result
   */
  static async saveResult(data: {
    userId?: string | null;
    wpm: number;
    rawWpm: number;
    accuracy: number;
    consistency?: number;
    duration: number;
    mode: TypingMode;
    language: LanguageOption;
    difficulty?: DifficultyOption;
    wordsCount?: number;
    errorsCount?: number;
    charCount?: number;
    passageId?: string | null;
    timelineJson?: string | null;
  }): Promise<TestResult> {
    const consistency = data.consistency ?? 100;
    const difficulty = data.difficulty ?? 'medium';
    const wordsCount = data.wordsCount ?? 0;
    const errorsCount = data.errorsCount ?? 0;
    const charCount = data.charCount ?? 0;

    try {
      const result = await prisma.testResult.create({
        data: {
          userId: data.userId || null,
          passageId: data.passageId || null,
          wpm: data.wpm,
          rawWpm: data.rawWpm,
          accuracy: data.accuracy,
          consistency,
          duration: data.duration,
          mode: data.mode,
          language: data.language,
          difficulty,
          wordsCount,
          errorsCount,
          charCount,
          timelineJson: data.timelineJson || null,
        },
        include: {
          user: {
            select: { name: true, image: true },
          },
        },
      });

      // Update user aggregate stats if authenticated
      if (data.userId) {
        const user = await prisma.user.findUnique({
          where: { id: data.userId },
          select: {
            bestWpm: true,
            testsCompleted: true,
            totalTimeTyped: true,
            avgWpm: true,
            avgAccuracy: true,
          },
        });

        if (user) {
          const newTestsCount = user.testsCompleted + 1;
          const newBestWpm = Math.max(user.bestWpm, data.wpm);
          const newTotalTime = user.totalTimeTyped + data.duration;
          const newAvgWpm = Math.round(((user.avgWpm * user.testsCompleted + data.wpm) / newTestsCount) * 10) / 10;
          const newAvgAcc = Math.round(((user.avgAccuracy * user.testsCompleted + data.accuracy) / newTestsCount) * 10) / 10;

          await prisma.user.update({
            where: { id: data.userId },
            data: {
              bestWpm: newBestWpm,
              testsCompleted: newTestsCount,
              totalTimeTyped: newTotalTime,
              avgWpm: newAvgWpm,
              avgAccuracy: newAvgAcc,
            },
          });

          // Register in leaderboard if eligible (accuracy >= 85%)
          if (data.accuracy >= 85) {
            await prisma.leaderboardEntry.create({
              data: {
                userId: data.userId,
                testResultId: result.id,
                wpm: data.wpm,
                accuracy: data.accuracy,
                duration: data.duration,
                mode: data.mode,
                language: data.language,
              },
            });
          }
        }
      }

      return {
        id: result.id,
        userId: result.userId,
        userName: result.user?.name ?? undefined,
        userImage: result.user?.image ?? undefined,
        passageId: result.passageId,
        wpm: result.wpm,
        rawWpm: result.rawWpm,
        accuracy: result.accuracy,
        consistency: result.consistency,
        duration: result.duration,
        mode: result.mode as TypingMode,
        language: result.language as LanguageOption,
        difficulty: result.difficulty as DifficultyOption,
        wordsCount: result.wordsCount,
        errorsCount: result.errorsCount,
        charCount: result.charCount,
        timelineJson: result.timelineJson,
        createdAt: result.createdAt,
      };
    } catch {
      // In-memory fallback
      return {
        id: generateId('test'),
        userId: data.userId || null,
        userName: 'Guest Typist',
        passageId: data.passageId || null,
        wpm: data.wpm,
        rawWpm: data.rawWpm,
        accuracy: data.accuracy,
        consistency,
        duration: data.duration,
        mode: data.mode,
        language: data.language,
        difficulty,
        wordsCount,
        errorsCount,
        charCount,
        timelineJson: data.timelineJson || null,
        createdAt: new Date(),
      };
    }
  }

  /**
   * Get single test result by ID
   */
  static async getById(id: string): Promise<TestResult | null> {
    try {
      const result = await prisma.testResult.findUnique({
        where: { id },
        include: {
          user: { select: { name: true, image: true } },
        },
      });

      if (result) {
        return {
          id: result.id,
          userId: result.userId,
          userName: result.user?.name ?? 'Anonymous',
          userImage: result.user?.image ?? undefined,
          passageId: result.passageId,
          wpm: result.wpm,
          rawWpm: result.rawWpm,
          accuracy: result.accuracy,
          consistency: result.consistency,
          duration: result.duration,
          mode: result.mode as TypingMode,
          language: result.language as LanguageOption,
          difficulty: result.difficulty as DifficultyOption,
          wordsCount: result.wordsCount,
          errorsCount: result.errorsCount,
          charCount: result.charCount,
          timelineJson: result.timelineJson,
          createdAt: result.createdAt,
        };
      }
    } catch {
      // Fallback
    }

    return null;
  }

  /**
   * Get test history for a specific user or recent global tests
   */
  static async getHistory(userId?: string, limit: number = 20): Promise<TestResult[]> {
    try {
      const results = await prisma.testResult.findMany({
        where: userId ? { userId } : {},
        orderBy: { createdAt: 'desc' },
        take: limit,
        include: {
          user: { select: { name: true, image: true } },
        },
      });

      return results.map((r) => ({
        id: r.id,
        userId: r.userId,
        userName: r.user?.name ?? 'Guest',
        userImage: r.user?.image ?? undefined,
        passageId: r.passageId,
        wpm: r.wpm,
        rawWpm: r.rawWpm,
        accuracy: r.accuracy,
        consistency: r.consistency,
        duration: r.duration,
        mode: r.mode as TypingMode,
        language: r.language as LanguageOption,
        difficulty: r.difficulty as DifficultyOption,
        wordsCount: r.wordsCount,
        errorsCount: r.errorsCount,
        charCount: r.charCount,
        timelineJson: r.timelineJson,
        createdAt: r.createdAt,
      }));
    } catch {
      return [];
    }
  }
}
