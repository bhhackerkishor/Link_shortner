"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { buttonVariants } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { CheckCircleIcon } from "lucide-react";
import { cn, PLANS } from "@/utils";

type Plan = {
  id: string;
  name: string;
  price: number;
  description: string;
  features: string[];
};

const PricingCards = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"monthly" | "yearly">("monthly");
  const [purchaseHistory, setPurchaseHistory] = useState<Array<any>>([]);

  useEffect(() => {
    const fetchPurchaseHistory = async () => {
      const res = await fetch("/api/user/purchase-history");
      const data = await res.json();
      setPurchaseHistory(data.history);
    };
    fetchPurchaseHistory();
  }, []);

  const handleSubscribe = async (planId: string, amount: number) => {
    setLoading(true);
    
    const res = await fetch("/api/payment/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ planId, amount }),
    });

    const data = await res.json();
    
    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
      amount: data.amount,
      currency: "INR",
      name: "Nodify",
      description: `Subscribe to ${planId}`,
      order_id: data.orderId,
      handler: async (response: any) => {
        await fetch("/api/payment/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...response, planId, amount }),
        });
        router.push("/dashboard");
      },
      theme: { color: "#4ADE80" },
    };

    const rzp = new (window as any).Razorpay(options);
    rzp.open();
    setLoading(false);
  };

  return (
    <div className="space-y-8">
      <Tabs value={activeTab} className="w-full flex flex-col items-center justify-center">
        <TabsList>
          <motion.div
            className="relative"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <TabsTrigger
              value="monthly"
              onClick={() => setActiveTab("monthly")}
              className={cn("relative", activeTab === "monthly" && "bg-background")}
            >
              Monthly
            </TabsTrigger>
          </motion.div>
          
          <motion.div
            className="relative"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <TabsTrigger
              value="yearly"
              onClick={() => setActiveTab("yearly")}
              className={cn("relative", activeTab === "yearly" && "bg-background")}
            >
              Yearly
              {activeTab === "yearly" && (
                <motion.span
                  className="absolute -top-2 -right-4 px-2 py-0.5 rounded-md bg-purple-500 text-white text-xs"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                >
                  Save 20%
                </motion.span>
              )}
            </TabsTrigger>
          </motion.div>
        </TabsList>

        <TabsContent value="monthly" className="grid grid-cols-1 lg:grid-cols-3 gap-5 w-full md:gap-8 max-w-5xl mx-auto pt-6">
          {PLANS.map((plan) => (
            <Card
              key={`${plan.name}-monthly`}
              className={cn(
                "border-border rounded-xl shadow-lg",
                plan.name === "Pro" && "border-2 border-purple-500 shadow-purple-500/20"
              )}
            >
              <CardHeader className={cn(
                "border-b border-border",
                plan.name === "Pro" ? "bg-purple-500/[0.07]" : "bg-foreground/[0.03]"
              )}>
                <CardTitle className={cn(plan.name !== "Pro" && "text-muted-foreground", "text-lg font-medium")}>
                  {plan.name}
                </CardTitle>
                <CardDescription>{plan.info}</CardDescription>
                <h5 className="text-3xl font-semibold">
                  ₹{plan.price.monthly}
                  <span className="text-base text-muted-foreground font-normal">
                    {plan.name !== "Free" ? "/month" : ""}
                  </span>
                </h5>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                {plan.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <CheckCircleIcon className="text-purple-500 w-4 h-4" />
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger className="text-left">
                          <p className={cn(feature.tooltip && "border-b border-dashed border-border")}>
                            {feature.text}
                          </p>
                        </TooltipTrigger>
                        {feature.tooltip && (
                          <TooltipContent>
                            <p>{feature.tooltip}</p>
                          </TooltipContent>
                        )}
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                ))}
              </CardContent>
              <CardFooter>
                <button
                  onClick={() => handleSubscribe(`${plan.name.toLowerCase()}_monthly`, plan.price.monthly)}
                  className={cn(
                    buttonVariants({ variant: "primary" }),
                    plan.name === "Pro" && "bg-purple-500 hover:bg-purple-600",
                    "w-full"
                  )}
                  disabled={loading}
                >
                  {loading ? "Processing..." : plan.btn.text}
                </button>
              </CardFooter>
            </Card>
          ))}
        </TabsContent>

        {/* Yearly Plans */}
        <TabsContent value="yearly" className="grid grid-cols-1 lg:grid-cols-3 gap-5 w-full md:gap-8 max-w-5xl mx-auto pt-6">
          {PLANS.map((plan) => (
            <Card
              key={`${plan.name}-yearly`}
              className={cn(
                "border-border rounded-xl shadow-lg",
                plan.name === "Pro" && "border-2 border-purple-500 shadow-purple-500/20"
              )}
            >
              <CardHeader className={cn(
                "border-b border-border",
                plan.name === "Pro" ? "bg-purple-500/[0.07]" : "bg-foreground/[0.03]"
              )}>
                <CardTitle className={cn(plan.name !== "Pro" && "text-muted-foreground", "text-lg font-medium")}>
                  {plan.name}
                </CardTitle>
                <CardDescription>{plan.info}</CardDescription>
                <h5 className="text-3xl font-semibold flex items-end">
                  ₹{plan.price.yearly}
                  <span className="text-base text-muted-foreground font-normal ml-1">
                    {plan.name !== "Free" ? "/year" : ""}
                  </span>
                </h5>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                {plan.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <CheckCircleIcon className="text-purple-500 w-4 h-4" />
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger className="text-left">
                          <p className={cn(feature.tooltip && "border-b border-dashed border-border")}>
                            {feature.text}
                          </p>
                        </TooltipTrigger>
                        {feature.tooltip && (
                          <TooltipContent>
                            <p>{feature.tooltip}</p>
                          </TooltipContent>
                        )}
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                ))}
              </CardContent>
              <CardFooter>
                <button
                  onClick={() => handleSubscribe(`${plan.name.toLowerCase()}_yearly`, plan.price.yearly)}
                  className={cn(
                    buttonVariants({ variant: "primary" }),
                    plan.name === "Pro" && "bg-purple-500 hover:bg-purple-600",
                    "w-full"
                  )}
                  disabled={loading}
                >
                  {loading ? "Processing..." : plan.btn.text}
                </button>
              </CardFooter>
            </Card>
          ))}
        </TabsContent>
      </Tabs>

      {/* Purchase History Section */}
      <div className="max-w-5xl mx-auto">
        <h3 className="text-2xl font-semibold mb-4">Purchase History</h3>
        <div className="space-y-4">
          {purchaseHistory && purchaseHistory?.length === 0 ? (
            <p className="text-muted-foreground">No subscription history found</p>
          ) : (
            purchaseHistory?.map((item, index) => (
              <Card key={index} className="bg-background">
                <CardContent className="pt-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium">{item.planName}</h4>
                      <p className="text-sm text-muted-foreground">
                        {new Date(item.subscribedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">₹{item.amount}</p>
                      <p className="text-sm text-muted-foreground">{item.billingCycle}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default PricingCards;