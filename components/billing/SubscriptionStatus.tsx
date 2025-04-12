"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
//import { cancelSubscription } from "@/actions/subscription";

export function SubscriptionStatus({ subscription }: { subscription: Subscription }) {
  return (
    <div className="border rounded-lg p-6 mb-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold">{subscription.plan}</h2>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant={subscription.status === 'active' ? 'success' : 'warning'}>
              {subscription.status}
            </Badge>
            <p className="text-sm text-muted-foreground">
              Renewal: {new Date(subscription.endDate).toLocaleDateString()}
            </p>
          </div>
        </div>
        {subscription.status === 'active' && (
          <Button 
            variant="destructive"
            onClick={async () => {
              await fetch(`/api/razorpay/subscription/${subscription.id}/cancel`);
              window.location.reload();
            }}
          >
            Cancel Subscription
          </Button>
        )}
      </div>
    </div>
  );
}