// components/billing/PricingCard.tsx
"use client";

import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";
import { loadRazorpay } from "@/lib/razorpay";

export function PricingCard({ plan }: { plan: SubscriptionPlan }) {
  const { user } = useUser();

  const handleSubscription = async () => {
    await loadRazorpay();
    
    const response = await fetch('/api/razorpay/subscription', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ planId: plan.razorpayPlanId })
    });

    const { subscriptionId, amount, currency } = await response.json();

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      subscription_id: subscriptionId,
      name: "Your App Name",
      description: plan.name,
      amount: amount,
      currency: currency,
      prefill: {
        email: user?.emailAddresses[0]?.emailAddress,
        name: user?.fullName
      },
      handler: async (response: any) => {
        await fetch('/api/users/subscription', {
          method: 'PUT',
          body: JSON.stringify(response)
        });
      }
    };

    // @ts-ignore
    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <div className="border rounded-lg p-6">
      <h3 className="text-xl font-bold">{plan.name}</h3>
      <div className="my-4">
        <span className="text-4xl font-bold">${plan.price}</span>
        <span className="text-muted-foreground">/{plan.interval}</span>
      </div>
      <Button className="w-full mt-6" onClick={handleSubscription}>
        Get Started
      </Button>
    </div>
  );
}