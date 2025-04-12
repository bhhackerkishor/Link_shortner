import { NextResponse } from 'next/server';
import crypto from 'crypto';
import User from '@/lib/models/User.model.js';

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get('X-Razorpay-Signature')!;
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
    .update(body)
    .digest('hex');

  if (signature !== expectedSignature) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }

  const event = JSON.parse(body);
  const { subscription_id, customer_id } = event.payload.subscription.entity;

  try {
    switch (event.event) {
      case 'subscription.activated':
        await User.updateOne(
          { 'subscription.razorpaySubscriptionId': subscription_id },
          {
            $set: {
              'subscription.status': 'active',
              'subscription.startDate': new Date(),
              'subscription.endDate': new Date(
                Date.now() + 365 * 24 * 60 * 60 * 1000
              )
            }
          }
        );
        break;

      case 'subscription.cancelled':
        await User.updateOne(
          { 'subscription.razorpaySubscriptionId': subscription_id },
          { $set: { 'subscription.status': 'cancelled' } }
        );
        break;

      case 'subscription.charged':
        await User.updateOne(
          { 'subscription.razorpaySubscriptionId': subscription_id },
          {
            $push: {
              paymentHistory: {
                amount: event.payload.payment.entity.amount,
                currency: event.payload.payment.entity.currency,
                transactionId: event.payload.payment.entity.id,
                status: 'completed'
              }
            }
          }
        );
        break;
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}
