// app/api/user/purchase-history/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib";
import { dbConnect } from "@/lib/db/db";

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    // Find user by clerkId and include purchase history
    const user = await db.user.findUnique({
      where: { clerkId: userId }
      ,include: {
        purchaseHistory: true, // include the relation explicitly
      },
    });

    if (!user) {
      return NextResponse.json({ history: [] });
    }

    return NextResponse.json({ history: user.purchaseHistory });
  } catch (error) {
    console.error("Error fetching purchase history:", error);
    return NextResponse.json({ error: "Failed to fetch history" }, { status: 500 });
  }
}
