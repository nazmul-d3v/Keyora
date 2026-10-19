import { NextResponse } from 'next/server';
import { LeaderboardService } from '@/services/leaderboardService';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const duration = searchParams.get('duration') ? parseInt(searchParams.get('duration')!, 10) : undefined;
    const mode = searchParams.get('mode') || undefined;
    const language = searchParams.get('language') || undefined;
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!, 10) : 50;

    const leaderboard = await LeaderboardService.getLeaderboard({
      duration,
      mode,
      language,
      limit,
    });

    return NextResponse.json(leaderboard);
  } catch (error: unknown) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
