import { NextResponse } from 'next/server';
import { razorpay } from '@/lib/razorpay';
import { auth } from '@clerk/nextjs/server';
import User from '@/lib/models/User';

export async function POST(req: Request) {
  const { userId } = auth();
  
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Get Clerk user details
    const userResponse = await fetch(
      `https://api.clerk.com/v1/users/${userId}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`
        }
      }
    );
    
    const clerkUser = await userResponse.json();

    // Create Razorpay customer
    const customer = await razorpay.customers.create({
      name: clerkUser.first_name + ' ' + clerkUser.last_name,
      email: clerkUser.email_addresses[0].email_address,
      notes: {
        clerkUserId: userId
      }
    });

    // Rest of the implementation...
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create subscription' },
      { status: 500 }
    );
  }
}