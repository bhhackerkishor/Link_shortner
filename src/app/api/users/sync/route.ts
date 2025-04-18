import { NextResponse, NextRequest } from 'next/server';
import User from '@/lib/db/models/User.model';

export async function POST(req: NextRequest) {
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
  } catch (error: unknown) {
    // Type assertion: We assert that the error is an instance of Error
    if (error instanceof Error) {
      return NextResponse.json(
        { error: 'User sync failed', details: error.message },
        { status: 500 }
      );
    }
    // Handle case when error is not an instance of Error
    return NextResponse.json(
      { error: 'User sync failed', details: 'Unknown error' },
      { status: 500 }
    );
  }
}
