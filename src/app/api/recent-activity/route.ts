// app/api/recent-activity/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import { Url } from '@/lib/db/models/Url';
import { dbConnect } from '@/lib/db/db';

export async function GET(req: NextRequest) {
  await dbConnect();
  const { userId } = getAuth(req as any);

  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const recentUrls = await Url.find({ userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .lean(); // Make it faster by returning plain objects

    return NextResponse.json({ data: recentUrls });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch recent activity' }, { status: 500 });
  }
}
