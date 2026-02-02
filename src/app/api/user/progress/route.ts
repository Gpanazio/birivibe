import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;

    const [xp, level] = await calculateXPAndLevel(userId);
    return NextResponse.json({ xp, level });
  } catch (error) {
    console.error('Error fetching progress:', error);
    return NextResponse.json(
      { error: 'Failed to fetch progress' },
      { status: 500 }
    );
  }
}

async function calculateXPAndLevel(userId: string): Promise<[number, number]> {
  const [habitXP, workoutXP] = await Promise.all([
    db.habitLog.count({
      where: {
        userId,
        date: { gte: new Date(new Date().setDate(new Date().getDate() - 7)) },
      },
    }),
    db.workout.count({
      where: {
        userId,
        date: { gte: new Date(new Date().setDate(new Date().getDate() - 7)) },
      },
    }),
  ]);

  const totalXP = habitXP * 10 + workoutXP * 50;
  const level = Math.floor(totalXP / 100) + 1;

  return [totalXP, level];
}
