import { auth } from '@clerk/nextjs';
import { Url } from '@/lib/models/Url';
import { connectDB } from '@/lib/db';

export async function POST(req) {
  try {
    await connectDB();

    const { userId } = auth(); // 👈 Get user ID from Clerk

    if (!userId) {
      return new Response('Unauthorized', { status: 401 });
    }

    const { originalUrl } = await req.json();

    // Optionally: check if URL is already shortened for this user
    const existing = await Url.findOne({ originalUrl, userId });
    if (existing) {
      return new Response(JSON.stringify(existing), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const shortId = generateShortId(); // use your own logic

    const newUrl = new Url({
      originalUrl,
      shortId,
      userId, // 👈 Pass userId to model
      clicks: [],
    });

    await newUrl.save();

    return new Response(JSON.stringify(newUrl), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error(error);
    return new Response('Server error', { status: 500 });
  }
}
