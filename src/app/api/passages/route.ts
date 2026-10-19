import { NextResponse } from 'next/server';
import { PassageService } from '@/services/passageService';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const language = searchParams.get('language') || undefined;
    const difficulty = searchParams.get('difficulty') || undefined;
    const category = searchParams.get('category') || undefined;
    const random = searchParams.get('random') === 'true';

    if (random) {
      const passage = await PassageService.getRandomPassage(language, difficulty);
      return NextResponse.json(passage);
    }

    const passages = await PassageService.getPassages({ language, difficulty, category });
    return NextResponse.json(passages);
  } catch (error: unknown) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
