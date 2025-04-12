// app/api/clerk/webhook/route.js
import { NextResponse } from 'next/server';
import { Webhook } from 'svix';
import User from '@/lib/models/User.model.js';

export async function POST(req) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;
  
  if (!WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 });
  }

  const payload = await req.text();
  const headers = Object.fromEntries(req.headers);

  const wh = new Webhook(WEBHOOK_SECRET);
  let event;

  try {
    event = wh.verify(payload, headers);
  } catch (err) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }

  switch (event.type) {
    case 'user.created':
      await handleUserCreated(event.data);
      break;
    case 'user.updated':
      await handleUserUpdated(event.data);
      break;
    case 'user.deleted':
      await handleUserDeleted(event.data);
      break;
  }

  return NextResponse.json({ success: true });
}

async function handleUserCreated(userData) {
  await User.create({
    clerkUserId: userData.id,
    email: userData.email_addresses[0]?.email_address,
    firstName: userData.first_name,
    lastName: userData.last_name,
    profileImage: userData.profile_image_url
  });
}

async function handleUserUpdated(userData) {
  await User.findOneAndUpdate(
    { clerkUserId: userData.id },
    {
      email: userData.email_addresses[0]?.email_address,
      firstName: userData.first_name,
      lastName: userData.last_name,
      profileImage: userData.profile_image_url,
      updatedAt: new Date()
    }
  );
}

async function handleUserDeleted(userData) {
  await User.findOneAndDelete({ clerkUserId: userData.id });
}