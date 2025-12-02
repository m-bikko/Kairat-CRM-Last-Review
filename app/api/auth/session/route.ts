import { NextResponse } from 'next/server';
import { getSession, destroySession } from '@/lib/auth';

export async function GET() {
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ user: null });
  }

  return NextResponse.json({ user: session });
}

export async function DELETE() {
  await destroySession();
  return NextResponse.json({ message: 'Logged out successfully' });
}
