// app/api/razorpay/subscription/[id]/cancel/route.ts
export async function POST(
    req: Request,
    { params }: { params: { id: string } }
  ) {
    await razorpay.subscriptions.cancel(params.id);
    return NextResponse.json({ success: true });
  }