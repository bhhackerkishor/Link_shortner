import { auth } from '@clerk/nextjs/server';
import User from '@/lib/models/User.model';
import { redirect } from 'next/navigation';
import { SubscriptionStatus } from '@/components/billing/SubscriptionStatus';
import { PricingCard } from '@/components/billing/PricingCard';

export default async function BillingPage() {
    const { userId } = await auth();
    console.log(userId)
    if (!userId) {
      redirect('/sign-in');
    }
  
    const userData = await User.findOne({ clerkUserId: userId })
      .select('subscription')
      .lean();
      console.log(userData)
  
    // Add default values for missing subscription
    const subscription = userData?.subscription || {
      plan: 'free',
      status: 'inactive',
      startDate: new Date(),
      endDate: new Date(),
    };
  
    return (
      <div className="max-w-6xl mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8">Subscription Management</h1>
        <SubscriptionStatus subscription={subscription} />
        {/* Pricing cards */}
      </div>
    );
  }