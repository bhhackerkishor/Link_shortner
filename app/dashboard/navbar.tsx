import React from "react";
import Link from "next/link";
import { UserButton} from "@clerk/nextjs";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar"; // Assuming you're using a UI library for Avatar

const DashboardNavbar = ({ user }: { user: { imageUrl?: string; firstName?: string } }) => {
  return (
    <header className="bg-background border-b">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        {/* Dashboard Title */}
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>

        {/* Navbar Links */}
        <div className="flex gap-6">
          <Link href="/" className="text-gray-900 hover:text-gray-600">Home</Link>
          <Link href="/pricing" className="text-gray-900 hover:text-gray-600">Pricing</Link>
          <Link href="/Settings" className="text-gray-900 hover:text-gray-600">Settings</Link> {/* Example additional link */}
          <Link href="/Profile" className="text-gray-900 hover:text-gray-600">Profile</Link> {/* Example additional link */}
        </div>

        {/* User Avatar */}
        <div className="flex items-center gap-4">
        <UserButton />
        </div>
      </div>
    </header>
  );
};

export default DashboardNavbar;
