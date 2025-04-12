import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";



export default function Home() {
  return (
    <div className="min-h-screen bg-white text-black">
    

      {/* Features Section */}
      <section className="py-20 px-6 bg-gray-100">
        <h2 className="text-4xl font-bold text-center">Why Choose RegondAI?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
          {["AI-Powered", "User-Friendly", "Scalable"].map((feature, index) => (
            <Card key={index} className="p-6 bg-white border border-gray-300 text-center">
              <CardContent>
                <h3 className="text-2xl font-semibold text-black">{feature}</h3>
                <p className="text-gray-600 mt-2">Experience the next-gen AI tools tailored for your needs.</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Subscription Plans Section */}
      <section className="py-20 px-6 bg-white text-center">
        <h2 className="text-4xl font-bold">Choose Your Plan</h2>
        <p className="text-gray-600 mt-4">Flexible pricing for all creators.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
          {[
            { name: "Free", price: "$0/mo", features: ["Basic AI tools", "Limited images", "Community support"] },
            { name: "Pro", price: "$19/mo", features: ["Advanced AI tools", "Unlimited images", "Priority support"] },
            { name: "Premium", price: "$49/mo", features: ["Pro features", "Commercial use", "Dedicated support"] },
          ].map((plan, index) => (
            <Card key={index} className="p-6 bg-gray-100 border border-gray-300 text-center">
              <CardContent>
                <h3 className="text-2xl font-semibold text-black">{plan.name}</h3>
                <p className="text-3xl font-bold mt-2 text-gray-800">{plan.price}</p>
                <ul className="text-gray-600 mt-4 space-y-2">
                  {plan.features.map((feature, i) => (
                    <li key={i}>&#10003; {feature}</li>
                  ))}
                </ul>
                <Button className="mt-6 bg-black text-white hover:bg-gray-800 px-6 py-2">Get {plan.name}</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

    </div>
  );
}