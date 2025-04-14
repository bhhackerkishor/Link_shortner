import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import crypto from "crypto";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib";
import { dbConnect } from "@/lib/db/db";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, planId, amount } = body;

    // 1. Verify Signature
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET!)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    // 2. Connect to DB
    await dbConnect();

    // Log request body to debug
    console.log("Request Body:", body);
    console.log("amount", amount, typeof amount);

    // 3. Validate amount
    if (!amount || isNaN(parseInt(amount))) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    // 4. Update User by clerkId (not ObjectId)
    const user = await db.user.update({
      where: { clerkId: userId },  // Search by clerkId instead of ObjectId
      data: {
        subscriptionActive: true,
        subscribedAt: new Date(),
        subscriptionPlan: planId,
        paymentId: razorpay_payment_id,
        billingCycle: planId.includes("year") ? "yearly" : "monthly",
        purchaseHistory: {
          create: {
            planName: planId,
            amount: parseInt(amount), // Ensure amount is parsed as an integer
            status: "success",
            subscribedAt: new Date(),
            billingCycle: planId.includes("year") ? "yearly" : "monthly",
          },
        },
      },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Verification Error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
