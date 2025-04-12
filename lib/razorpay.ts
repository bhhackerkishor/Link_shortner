import Razorpay from 'razorpay';

export const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!
});

export const createRazorpaySubscription = async (
  planId: string,
  customerId: string
) => {
  return razorpay.subscriptions.create({
    plan_id: planId,
    customer_id: customerId,
    total_count: 12, // 1 year subscription
    notes: {
      platform: 'web'
    }
  });
};
export const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };