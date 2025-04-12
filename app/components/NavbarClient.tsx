// app/components/NavbarClient.tsx
"use client";  // This makes this file a client-side component

import { usePathname } from "next/navigation";  // Import usePathname
import Navbar from "./navbar";

const NavbarClient = () => {
  const pathname = usePathname(); // Get the current pathname

  // Check if the current path is "/dashboard" and don't render Navbar in that case
  const isDashboard = pathname?.startsWith("/dashboard");

  // Conditionally render the navbar based on the current path
  if (isDashboard) return null;

  return (
    <nav>
      {/* Your Navbar JSX */}
      <Navbar />
    </nav>
  );
};

export default NavbarClient;
