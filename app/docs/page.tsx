"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function DocumentationPage() {
  const [tab, setTab] = useState("introduction");

  return (
    <div className="container mx-auto p-6">
      <motion.h1
        className="text-4xl font-bold text-center mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Regond AI Documentation
      </motion.h1>
      
      <Tabs defaultValue={tab} onValueChange={setTab} className="w-full">
        <TabsList className="flex justify-center gap-4 mb-6">
          <TabsTrigger value="introduction">Introduction</TabsTrigger>
          <TabsTrigger value="pricing">Pricing</TabsTrigger>
          <TabsTrigger value="api">API Usage</TabsTrigger>
          <TabsTrigger value="faq">FAQ</TabsTrigger>
        </TabsList>

        <TabsContent value="introduction">
          <Card>
            <CardHeader>
              <CardTitle>Welcome to Regond AI</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Regond AI provides advanced AI-powered solutions with a flexible credit system.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pricing">
          <Card>
            <CardHeader>
              <CardTitle>Pricing Plans</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Choose between monthly or yearly plans based on your needs. We also offer a free plan with 10 credits.</p>
              <Button className="mt-4">View Pricing</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="api">
          <Card>
            <CardHeader>
              <CardTitle>API Usage</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Learn how to integrate Regond AI into your applications with our powerful API.</p>
              <code className="block bg-gray-800 text-white p-2 mt-2 rounded">GET /api/v1/your-endpoint</code>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="faq">
          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Find answers to common questions about Regond AI and our credit system.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}