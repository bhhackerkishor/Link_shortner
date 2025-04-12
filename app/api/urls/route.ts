// app/api/urls/route.ts
import { NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import { Url } from '@/lib/models/Url';
import {dbConnect} from '@/lib/db';
import { generateShortId } from '@/app/utils/shortId';

export async function POST(req: Request) {
  await dbConnect();
  const { userId } = getAuth(req as any);
  const { url } = await req.json();

  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (!url) return NextResponse.json({ error: 'URL is required' }, { status: 400 });

  try {
    const shortId = generateShortId();
    const newUrl = await Url.create({
      originalUrl: url,
      shortId,
      userId
    });

    return NextResponse.json(newUrl);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create URL' },
      { status: 500 }
    );
  }
}