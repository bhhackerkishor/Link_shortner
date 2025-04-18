import Sidebar from "@/components/navigation/dashboard-navbar";
import Script from "next/script";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <Sidebar />
      {/* ✅ Razorpay script using Next.js <Script /> */}
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="beforeInteractive"
      />
      <main className="md:ml-[270px] p-4 md:p-6 transition-all duration-300">
        {children}
      </main>
    </div>
  );
}
