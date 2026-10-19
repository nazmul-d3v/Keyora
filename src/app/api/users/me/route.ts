import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { profileUpdateSchema } from '@/lib/validations';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as { id?: string })?.id;
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        bio: true,
        theme: true,
        keyboardLayout: true,
        soundEnabled: true,
        soundType: true,
        soundVolume: true,
        caretStyle: true,
        bestWpm: true,
        avgWpm: true,
        avgAccuracy: true,
        testsCompleted: true,
        totalTimeTyped: true,
        createdAt: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error: unknown) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as { id?: string })?.id;
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const parseRes = profileUpdateSchema.safeParse(body);
    if (!parseRes.success) {
      return NextResponse.json({ error: 'Invalid profile data' }, { status: 400 });
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data: parseRes.data,
      select: {
        id: true,
        name: true,
        image: true,
        theme: true,
        soundEnabled: true,
        soundType: true,
        soundVolume: true,
        caretStyle: true,
        bio: true,
      },
    });

    return NextResponse.json(updated);
  } catch (error: unknown) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
