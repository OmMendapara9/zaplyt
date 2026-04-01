"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";

export default function SplashScreen() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!showSplash && !isLoading) {
      if (isAuthenticated) {
        router.push("/home");
      } else {
        router.push("/onboarding");
      }
    }
  }, [showSplash, isLoading, isAuthenticated, router]);

  return (
    <div className="min-h-screen bg-primary flex flex-col items-center justify-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="flex flex-col items-center gap-4"
      >
        {/* Logo */}
        <div className="w-24 h-24 bg-white rounded-2xl flex items-center justify-center shadow-lg">
          <svg
            viewBox="0 0 64 64"
            className="w-16 h-16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M32 8L8 20v24l24 12 24-12V20L32 8z"
              fill="#1E3A8A"
              stroke="#1E3A8A"
              strokeWidth="2"
            />
            <path
              d="M32 20l-12 6v12l12 6 12-6V26l-12-6z"
              fill="white"
              stroke="white"
              strokeWidth="2"
            />
            <circle cx="32" cy="32" r="4" fill="#22C55E" />
          </svg>
        </div>

        {/* Brand Name */}
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-4xl font-bold text-white tracking-wide"
        >
          Zaplyt
        </motion.h1>

        {/* Tagline */}
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="text-white/80 text-sm"
        >
          Home Services at Your Doorstep
        </motion.p>
      </motion.div>

      {/* Loading indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="absolute bottom-20"
      >
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 bg-white/60 rounded-full"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.6, 1, 0.6],
              }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}
