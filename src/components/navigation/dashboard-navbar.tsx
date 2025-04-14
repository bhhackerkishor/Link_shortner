"use client";

import Link from "next/link";
import {
  LayoutDashboard,
  Link as LinkIcon,
  LineChart,
  Package,
  LogOut,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserButton,useClerk} from "@clerk/nextjs";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

const sidebarItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: LinkIcon, label: "Links", href: "/dashboard/links" },
  { icon: LineChart, label: "Analytics", href: "/dashboard/analytics" },
  { icon: Package, label: "Plans", href: "/dashboard/plans" },
  { icon: Settings, label: "Settings", href: "/dashboard/settings" },
];

export default function Sidebar() {
  const { user,signOut } = useClerk();
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Handle window resize and mobile detection
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) setIsOpen(true);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Close sidebar on mobile when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (isMobile && isOpen) {
        const sidebar = document.querySelector(".sidebar");
        if (sidebar && !sidebar.contains(e.target as Node)) {
          setIsOpen(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMobile, isOpen]);

  return (
    <>
      {/* Mobile Menu Toggle */}
      <div className="md:hidden p-4 bg-black text-white flex items-center justify-between sticky top-0 z-40">
        <h2 className="text-lg font-bold">Nodify</h2>
        <Button
          variant="ghost"
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </Button>
      </div>

      {/* Overlay for mobile */}
      {isOpen && isMobile && (
        <div className="fixed inset-0 bg-black/50 z-40 md:hidden" />
      )}

      {/* Sidebar */}
      <div
        className={`sidebar fixed top-0 left-0 h-screen w-[270px] bg-black p-6 border-r border-[#262626] flex flex-col justify-between z-50 transition-transform duration-300 ease-in-out ${
          isMobile ? (isOpen ? "translate-x-0" : "-translate-x-full") : ""
        }`}
      >
        {/* Logo */}
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 bg-white rounded-lg" />
          <h2 className="text-white font-semibold text-lg">Nodify</h2>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1 flex-1">
          {sidebarItems.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              onClick={() => isMobile && setIsOpen(false)}
            >
              <Button
                variant="ghost"
                className="w-full justify-start text-[#A3A3A3] hover:text-white hover:bg-[#171717]"
              >
                <item.icon className="w-4 h-4 mr-2" />
                {item.label}
              </Button>
            </Link>
          ))}
        </nav>

        {/* User Info and Logout */}
        <div className="mt-6">
          {user ? (
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <UserButton
                  afterSignOutUrl="/"
                  appearance={{
                    elements: {
                      avatarBox: "w-12 h-12",
                    },
                  }}
                />
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-white">
                    {user.fullName}
                  </span>
                  <span className="text-xs text-gray-400 truncate">
                    {user.primaryEmailAddress?.emailAddress}
                  </span>
                </div>
              </div>
              <Button
                variant="outline"
                onClick={() => {
                  signOut();
                  if (isMobile) setIsOpen(false);
                }}
                className="w-full flex items-center gap-2 text-red-500 hover:bg-red-500/10 border-red-500/30"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </Button>
            </div>
          ) : (
            <div className="text-sm text-gray-500">Not signed in</div>
          )}
        </div>
      </div>
    </>
  );
}