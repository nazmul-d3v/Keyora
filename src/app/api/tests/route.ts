import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { TestService } from '@/services/testService';
import { testResultSchema } from '@/lib/validations';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId') || undefined;
    const limit = parseInt(searchParams.get('limit') || '20', 10);

    const history = await TestService.getHistory(userId, limit);
    return NextResponse.json(history);
  } catch (error: unknown) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const body = await req.json();

    const parseRes = testResultSchema.safeParse(body);
    if (!parseRes.success) {
      return NextResponse.json(
        { error: 'Invalid test payload', details: parseRes.error.format() },
        { status: 400 }
      );
    }

    const data = parseRes.data;
    const sessionUserId = (session?.user as { id?: string })?.id || null;
    const saved = await TestService.saveResult({
      userId: sessionUserId,
      wpm: data.wpm,
      rawWpm: data.rawWpm,
      accuracy: data.accuracy,
      consistency: data.consistency,
      duration: data.duration,
      mode: data.mode,
      language: data.language,
      difficulty: data.difficulty,
      wordsCount: data.wordsCount,
      errorsCount: data.errorsCount,
      charCount: data.charCount,
      passageId: data.passageId,
      timelineJson: data.timelineJson,
    });

    return NextResponse.json(saved, { status: 201 });
  } catch (error: unknown) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
