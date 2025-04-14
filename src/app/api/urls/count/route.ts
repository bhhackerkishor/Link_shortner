// app/api/urls/count/route.ts
import { NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import { Url } from '@/lib/db/models/Url';
import {dbConnect} from '@/lib/db/db';

export async function GET(req: Request) {
  await dbConnect();
  const { userId } = getAuth(req as any);

  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const count = await Url.countDocuments({ userId });
    return NextResponse.json({ total: count });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to count URLs' },
      { status: 500 }
    );
  }
}