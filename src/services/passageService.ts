import { prisma } from '@/lib/prisma';
import { PASSAGES } from '@/data/passages';
import { Passage, LanguageOption, DifficultyOption } from '@/types';

export class PassageService {
  /**
   * Get all passages, filtered optionally by language and difficulty
   */
  static async getPassages(filter?: {
    language?: string;
    difficulty?: string;
    category?: string;
  }): Promise<Passage[]> {
    try {
      const where: Record<string, string> = {};
      if (filter?.language && filter.language !== 'all') where.language = filter.language;
      if (filter?.difficulty && filter.difficulty !== 'all') where.difficulty = filter.difficulty;
      if (filter?.category && filter.category !== 'all') where.category = filter.category;

      const dbPassages = await prisma.passage.findMany({
        where,
        orderBy: { createdAt: 'desc' },
      });

      if (dbPassages && dbPassages.length > 0) {
        return dbPassages.map((p) => ({
          ...p,
          language: p.language as LanguageOption,
          difficulty: p.difficulty as DifficultyOption,
          source: p.source ?? undefined,
        }));
      }
    } catch {
      // Fallback to static passages
    }

    return PASSAGES.filter((p) => {
      if (filter?.language && filter.language !== 'all' && p.language !== filter.language) return false;
      if (filter?.difficulty && filter.difficulty !== 'all' && p.difficulty !== filter.difficulty) return false;
      if (filter?.category && filter.category !== 'all' && p.category !== filter.category) return false;
      return true;
    });
  }

  /**
   * Get a random passage according to criteria
   */
  static async getRandomPassage(language: string = 'english', difficulty: string = 'medium'): Promise<Passage> {
    const list = await this.getPassages({ language, difficulty });
    if (list.length > 0) {
      const randomIndex = Math.floor(Math.random() * list.length);
      return list[randomIndex];
    }
    // Fallback to the first available static passage
    return PASSAGES[0];
  }

  /**
   * Get single passage by ID
   */
  static async getById(id: string): Promise<Passage | null> {
    try {
      const p = await prisma.passage.findUnique({ where: { id } });
      if (p) {
        return {
          ...p,
          language: p.language as LanguageOption,
          difficulty: p.difficulty as DifficultyOption,
          source: p.source ?? undefined,
        };
      }
    } catch {
      // Fallback
    }

    const found = PASSAGES.find((item) => item.id === id);
    return found || null;
  }
}
