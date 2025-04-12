// app/api/clicks/[shortId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { Url } from '@/models/Url';
import { Click } from '@/models/Click';
import dbConnect from '@/lib/db';

export async function GET(req: NextRequest, { params }: { params: { shortId: string } }) {
  await dbConnect();
  
  try {
    const url = await Url.findOne({ shortId: params.shortId }).populate('clicks');
    if (!url) return NextResponse.json({ error: 'URL not found' }, { status: 404 });

    return NextResponse.json(url.clicks);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch clicks' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest, { params }: { params: { shortId: string } }) {
  await dbConnect();
  const data = await req.json();

  try {
    const url = await Url.findOne({ shortId: params.shortId });
    if (!url) return NextResponse.json({ error: 'URL not found' }, { status: 404 });

    const click = await Click.create(data);
    url.clicks.push(click._id);
    await url.save();

    return NextResponse.json(click);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to track click' },
      { status: 500 }
    );
  }
}