"use client";

import * as React from "react";
import Link from "next/link";
import { useUser, UserButton, SignInButton, SignUpButton } from "@clerk/nextjs";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

const features = [
  { title: "AI Upscaling", href: "/upscaling" },
  { title: "Text-to-Image", href: "/text-to-image" },
  { title: "Image Enhancement", href: "/enhancement" },
  { title: "Url Shortner", href: "/url-shortner" },
];

export default function Navbar() {
  const [isMobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const { isSignedIn } = useUser();

  return (
    <nav className="border-b shadow-sm bg-white/50 backdrop-blur-md sticky top-0 w-full z-50">

      <div className="container  flex justify-between items-center p-4">
      <div className="flex items-center justify-between pl-6">
          <Link href="/" className="flex items-center text-xl font-bold space-x-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              version="1.0"
              viewBox="0 0 300.000000 300.000000"
              preserveAspectRatio="xMidYMid meet"
              className="h-6 w-6"
            >
              <g
                transform="translate(0.000000,300.000000) scale(0.100000,-0.100000)"
                fill="#000000"
                stroke="none"
              >
                <path d="M2517 2870 c-21 -6 -50 -16 -66 -24 -38 -20 -100 -90 -118 -135 -22 -52 -20 -148 5 -204 l21 -47 -61 -72 c-33 -40 -63 -76 -67 -81 -4 -4 -36 7 -72 24 -333 163 -790 188 -1155 65 -415 -140 -680 -414 -760 -786 -21 -100 -18 -310 6 -404 89 -347 379 -495 1015 -514 l210 -7 5 -130 c3 -76 10 -139 17 -152 22 -38 63 -63 105 -63 67 0 126 40 342 228 141 122 197 158 278 176 295 68 478 234 534 483 25 114 15 338 -20 456 -58 193 -161 348 -325 489 l-54 47 29 38 c16 21 44 54 62 75 31 34 34 36 70 26 119 -33 265 48 306 170 66 192 -112 390 -307 342z m96 -154 c43 -18 67 -46 73 -88 18 -106 -121 -169 -190 -87 -50 59 -32 144 37 174 40 18 41 18 80 1z m-867 -411 c138 -24 374 -102 374 -124 0 -4 -29 -42 -65 -85 -74 -88 -82 -120 -40 -161 45 -46 78 -30 169 81 38 46 73 84 78 84 5 0 53 -44 106 -97 112 -113 168 -201 214 -337 26 -77 32 -110 36 -220 7 -189 -23 -296 -111 -391 -72 -77 -149 -115 -368 -179 -74 -21 -152 -73 -284 -187 -142 -123 -209 -178 -216 -179 -4 0 -9 51 -11 112 -4 124 -18 164 -65 195 -23 15 -62 19 -258 24 -342 10 -511 38 -660 109 -194 93 -265 218 -265 466 0 241 79 425 256 595 154 147 372 253 594 289 41 6 82 13 90 15 53 10 349 3 426 -10z"/>
                <path d="M1214 1719 c-44 -16 -54 -46 -54 -165 0 -97 3 -115 21 -138 26 -33 79 -36 109 -6 18 18 20 33 20 141 0 66 -4 129 -10 139 -13 23 -59 39 -86 29z"/>
                <path d="M1583 1720 c-36 -14 -43 -43 -43 -169 0 -108 2 -123 20 -141 28 -28 75 -26 105 5 24 23 25 30 25 139 0 105 -2 117 -22 140 -27 29 -55 38 -85 26z"/>
              </g>
            </svg>
            <span>RegondAI</span>
          </Link>
        </div>


        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-6 items-center">
          <Link href="/" className="hover:text-gray-600">Home</Link>

          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Features</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="p-4 w-48 bg-white shadow-md rounded-md">
                    {features.map((feature) => (
                      <li key={feature.title} className="py-1">
                        <Link href={feature.href} className="hover:text-gray-600 block">
                          {feature.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
          <Link href="/pricing" className="hover:text-gray-600">Pricing</Link>
          <Link href="/docs" className="hover:text-gray-600">Documentation</Link>

          
          
          {/* Clerk Authentication Buttons */}
          {isSignedIn ? (
            <>
            <UserButton />
            <Link href="/dashboard" className="hover:text-gray-600"><Button>Dashboard</Button></Link>
            </>
          ) : (
            <div className="flex space-x-2">
              <SignInButton>
                <Button variant="outline">Sign In</Button>
              </SignInButton>
              <SignUpButton>
                <Button>Sign Up</Button>
              </SignUpButton>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <Button variant="ghost" className="md:hidden" onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}>
          <Menu size={24} />
        </Button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden p-4 bg-white border-t shadow-md">
          <Link href="/" className="block py-2" onClick={() => setMobileMenuOpen(false)}>Home</Link>
          <div>
            <button className="w-full text-left py-2" onClick={() => setMobileMenuOpen(false)}>Features</button>
            <div className="pl-4">
              {features.map((feature) => (
                <Link key={feature.title} href={feature.href} className="block py-1" onClick={() => setMobileMenuOpen(false)}>
                  {feature.title}
                </Link>
              ))}
            </div>
          </div>
          <Link href="/pricing" className="block py-2" onClick={() => setMobileMenuOpen(false)}>Pricing</Link>
          <Link href="/docs" className="block py-2" onClick={() => setMobileMenuOpen(false)}>Documentation</Link>
          
          {/* Mobile Auth Buttons */}
          {isSignedIn ? (
            <UserButton />
          ) : (
            <div className="mt-4 flex flex-col space-y-2">
              <SignInButton>
                <Button variant="outline" className="w-full">Sign In</Button>
              </SignInButton>
              <SignUpButton>
                <Button className="w-full">Sign Up</Button>
              </SignUpButton>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}