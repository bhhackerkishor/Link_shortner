import { auth } from "@clerk/nextjs/server";
import { connectDB } from "@/lib/db";
import { Url } from "@/lib/models/Url";

export async function POST(req) {
  await connectDB();

  const { userId } = await auth();
  const authData = await auth();
  console.log("authData", authData);
  
  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { originalUrl } = await req.json();

  // Check if already exists
  const existing = await Url.findOne({ originalUrl, userId });
  if (existing) {
    return Response.json(existing);
  }

  // Create new shortened URL
  const shortId = Math.random().toString(36).substring(2, 8);
  const newUrl = new Url({
    originalUrl,
    shortId,
    userId,
    clicks: [],
  });

  await newUrl.save();

  return Response.json(newUrl);
}
