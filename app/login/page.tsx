"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ChevronLeft, Phone } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const [phone, setPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (phone.length < 10) {
      setError("Please enter a valid 10-digit phone number");
      return;
    }

    setIsLoading(true);

    try {
      const result = await login(phone);
      if (result.success) {
        router.push(`/verify-otp?phone=${encodeURIComponent(phone)}`);
      } else {
        setError(result.message);
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const formatPhone = (value: string) => {
    // Remove non-digits
    const digits = value.replace(/\D/g, "");
    // Limit to 10 digits
    return digits.slice(0, 10);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="p-4">
        <Link
          href="/onboarding"
          className="w-10 h-10 bg-muted rounded-full flex items-center justify-center"
        >
          <ChevronLeft className="w-5 h-5 text-foreground" />
        </Link>
      </div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex-1 px-6 pt-4"
      >
        <h1 className="text-2xl font-bold text-foreground mb-2">
          Enter your phone number
        </h1>
        <p className="text-muted-foreground mb-8">
          We will send you an OTP to verify your number
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Phone input */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Phone Number
            </label>
            <div className="flex gap-3">
              {/* Country code */}
              <div className="flex items-center gap-2 px-4 py-3 bg-muted rounded-xl border border-border">
                <span className="text-lg">🇮🇳</span>
                <span className="font-medium">+91</span>
              </div>

              {/* Phone input */}
              <div className="flex-1 relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2">
                  <Phone className="w-5 h-5 text-muted-foreground" />
                </div>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(formatPhone(e.target.value))}
                  placeholder="Enter phone number"
                  className="w-full pl-12 pr-4 py-3 bg-muted rounded-xl border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors text-lg tracking-wide"
                  autoFocus
                />
              </div>
            </div>
          </div>

          {/* Error message */}
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-destructive text-sm"
            >
              {error}
            </motion.p>
          )}

          {/* Submit button */}
          <button
            type="submit"
            disabled={phone.length < 10 || isLoading}
            className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] transition-all"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Sending OTP...
              </span>
            ) : (
              "Send OTP"
            )}
          </button>
        </form>

        {/* Terms */}
        <p className="text-xs text-muted-foreground text-center mt-8 leading-relaxed">
          By continuing, you agree to our{" "}
          <span className="text-primary font-medium">Terms of Service</span> and{" "}
          <span className="text-primary font-medium">Privacy Policy</span>
        </p>
      </motion.div>

      {/* Demo hint */}
      <div className="p-4 bg-muted/50 mx-4 mb-4 rounded-xl">
        <p className="text-xs text-muted-foreground text-center">
          Demo: Use any 10-digit number. OTP is <span className="font-mono font-bold">1234</span>
        </p>
      </div>
    </div>
  );
}
