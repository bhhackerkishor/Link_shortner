// app/api/users/sync/route.js
import { NextResponse } from 'next/server';
import User from '@/lib/db/models/User.model';

export async function POST(req) {
  try {
    const userData = await req.json();
    
    const existingUser = await User.findOne({ clerkUserId: userData.clerkUserId });

    if (existingUser) {
      const updatedUser = await User.findOneAndUpdate(
        { clerkUserId: userData.clerkUserId },
        userData,
        { new: true }
      );
      return NextResponse.json(updatedUser);
    }

    const newUser = await User.create(userData);
    return NextResponse.json(newUser);
  } catch (error) {
    return NextResponse.json(
      { error: 'User sync failed', details: error.message },
      { status: 500 }
    );
  }
}