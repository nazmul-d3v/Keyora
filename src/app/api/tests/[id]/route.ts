import { NextResponse } from 'next/server';
import { TestService } from '@/services/testService';

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const result = await TestService.getById(params.id);
    if (!result) {
      return NextResponse.json({ error: 'Test result not found' }, { status: 404 });
    }
    return NextResponse.json(result);
  } catch (error: unknown) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
