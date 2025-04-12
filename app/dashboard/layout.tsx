// app/dashboard/layout.tsx


export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Dashboard Navbar */}
      

      <main className="flex-1">
        {children} {/* Renders the page content for dashboard */}
      </main>

      
    </div>
  );
}
