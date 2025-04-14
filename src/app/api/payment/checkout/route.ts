// app/api/payment/checkout/route.ts
import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import { auth } from "@clerk/nextjs/server";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_SECRET!,
});

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { planId, amount } = await req.json();

    const options = {
      amount: amount * 100, // in paise
      currency: "INR",
      receipt: `${planId}_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    return NextResponse.json({ orderId: order.id, amount: order.amount });
  } catch (err) {
    console.error("Checkout Error:", err);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}
