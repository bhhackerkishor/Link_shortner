import Sidebar from "@/components/navigation/dashboard-navbar";


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <Sidebar />
      <main className="md:ml-[270px] p-4 md:p-6 transition-all duration-300">
        {children}
      </main>
    </div>
  )
}
