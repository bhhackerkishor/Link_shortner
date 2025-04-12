// app/api/user-urls/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import { Url } from '@/lib/models/Url';
import {dbConnect} from '@/lib/db';

export async function GET(req: NextRequest) {
  await dbConnect();
  const { userId } = getAuth(req as any);

  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');
  const sortField = searchParams.get('sortField') || 'createdAt';
  const sortOrder = searchParams.get('sortOrder') || 'desc';
  const search = searchParams.get('search') || '';
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');

  try {
    const query: any = { userId };
    
    if (search) {
      query.$or = [
        { originalUrl: { $regex: search, $options: 'i' } },
        { shortId: { $regex: search, $options: 'i' } }
      ];
    }

    if (startDate && endDate) {
      query.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const [urls, total] = await Promise.all([
      Url.find(query)
        .sort({ [sortField]: sortOrder === 'asc' ? 1 : -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .populate('clicks'),
      Url.countDocuments(query)
    ]);

    return NextResponse.json({
      data: urls,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch URLs' },
      { status: 500 }
    );
  }
}