"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function CTASection() {
  const [hovered, setHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect if the user is on a mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(/Mobi|Android|iPhone|iPad/.test(navigator.userAgent));
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const toggleHover = () => setHovered(!hovered); // Tap to switch on mobile

  return (
    <section className="flex flex-col items-center justify-center p-10">
      <h1 className="text-4xl font-bold text-center mb-4">
        Transform Your Photos into <span className="text-blue-600">Ghibli Art</span>
      </h1>
      <p className="text-lg text-gray-500 text-center mb-4">
        Upload your image and watch the magic happen!
      </p>

      {/* Instruction Message */}
      <p className="text-sm text-gray-400 mb-2">
        {isMobile ? "📱 Touch the image & see the magic!" : "🖱️ Hover over the image & see the magic!"}
      </p>

      <div
        className="relative w-80 h-80 bg-gray-200 flex items-center justify-center rounded-2xl border-4 border-gray-300 shadow-lg"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Original Image */}
        <motion.img
          src="https://res.cloudinary.com/drmjevfh8/image/upload/v1743413658/WIN_20250311_12_42_45_Pro_ps6nsl.jpg"
          alt="Original Image"
          className="absolute inset-0 w-full h-full object-contain"
          animate={{ opacity: hovered ? 0 : 1 }}
          transition={{ duration: 0.5 }}
          onTap={toggleHover} // Tap to switch on mobile
        />

        {/* Ghibli Transformed Image */}
        <motion.img
          src="https://res.cloudinary.com/drmjevfh8/image/upload/v1743413769/RegondAi-image-1743413626323_idipkz.png"
          alt="Ghibli Image"
          className="absolute inset-0 w-full h-full object-contain"
          animate={{ opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.5 }}
          onTap={toggleHover} // Tap to switch on mobile
        />
      </div>

      <Link href="/ghibli">
        <button className="mt-6 px-6 py-3 bg-blue-600 text-white font-semibold text-lg rounded-lg shadow-lg hover:bg-blue-700 transition">
          Try It Now
        </button>
      </Link>
    </section>
  );
}
