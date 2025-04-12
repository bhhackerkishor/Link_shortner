export interface Subscription {
    id: string;
    plan: string;
    status: 'active' | 'pending' | 'cancelled' | 'expired';
    startDate: Date;
    endDate: Date;
    razorpayCustomerId: string;
    razorpaySubscriptionId: string;
    paymentHistory: Payment[];
  }
  
  interface Payment {
    amount: number;
    currency: string;
    date: Date;
    transactionId: string;
    status: 'completed' | 'pending' | 'failed';
  }
  // types/subscription.js
export const SubscriptionPlan = {
  FREE: 'free',
  STARTER: 'starter',
  PROFESSIONAL: 'professional',
  ENTERPRISE: 'enterprise'
};

export const SubscriptionStatus = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  TRIALING: 'trialing',
  PAST_DUE: 'past_due',
  CANCELED: 'canceled',
  UNPAID: 'unpaid'
};

export const BillingInterval = {
  MONTHLY: 'monthly',
  ANNUAL: 'annual',
  LIFETIME: 'lifetime'
};

export const CancellationReason = {
  TOO_EXPENSIVE: 'too_expensive',
  MISSING_FEATURES: 'missing_features',
  NOT_USING: 'not_using',
  CUSTOMER_SERVICE: 'customer_service',
  OTHER: 'other'
};