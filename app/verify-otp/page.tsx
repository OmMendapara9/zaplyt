"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

function VerifyOTPContent() {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [resendTimer, setResendTimer] = useState(30);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const router = useRouter();
  const searchParams = useSearchParams();
  const phone = searchParams.get("phone") || "";
  const { verifyOtp, login } = useAuth();

  useEffect(() => {
    // Focus first input
    inputRefs.current[0]?.focus();
  }, []);

  useEffect(() => {
    // Resend timer
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    setError("");

    // Auto-focus next input
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all filled
    if (newOtp.every((digit) => digit) && newOtp.join("").length === 4) {
      handleVerify(newOtp.join(""));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 4);
    if (pastedData.length === 4) {
      setOtp(pastedData.split(""));
      handleVerify(pastedData);
    }
  };

  const handleVerify = async (otpValue: string) => {
    setIsLoading(true);
    setError("");

    try {
      const result = await verifyOtp(phone, otpValue);
      if (result.success) {
        router.push("/home");
      } else {
        setError(result.message);
        setOtp(["", "", "", ""]);
        inputRefs.current[0]?.focus();
      }
    } catch {
      setError("Verification failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendTimer > 0) return;
    
    setResendTimer(30);
    await login(phone);
  };

  const maskedPhone = phone ? `XXXXXX${phone.slice(-4)}` : "";

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="p-4">
        <Link
          href="/login"
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
          Enter verification code
        </h1>
        <p className="text-muted-foreground mb-8">
          We have sent a 4-digit OTP to{" "}
          <span className="font-medium text-foreground">+91 {maskedPhone}</span>
        </p>

        {/* OTP inputs */}
        <div className="flex justify-center gap-4 mb-6">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => { inputRefs.current[index] = el; }}
              type="tel"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              className={`w-14 h-14 text-center text-2xl font-bold rounded-xl border-2 outline-none transition-colors ${
                digit
                  ? "border-primary bg-primary/5"
                  : "border-border bg-muted"
              } focus:border-primary focus:bg-primary/5`}
              disabled={isLoading}
            />
          ))}
        </div>

        {/* Error message */}
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-destructive text-sm text-center mb-4"
          >
            {error}
          </motion.p>
        )}

        {/* Loading indicator */}
        {isLoading && (
          <div className="flex justify-center mb-4">
            <span className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
          </div>
        )}

        {/* Resend OTP */}
        <div className="text-center">
          <p className="text-muted-foreground text-sm">
            {"Didn't receive the code?"}{" "}
            {resendTimer > 0 ? (
              <span className="text-foreground font-medium">
                Resend in {resendTimer}s
              </span>
            ) : (
              <button
                onClick={handleResend}
                className="text-primary font-medium"
              >
                Resend OTP
              </button>
            )}
          </p>
        </div>

        {/* Verify button */}
        <button
          onClick={() => handleVerify(otp.join(""))}
          disabled={otp.some((d) => !d) || isLoading}
          className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] transition-all mt-8"
        >
          {isLoading ? "Verifying..." : "Verify"}
        </button>
      </motion.div>

      {/* Demo hint */}
      <div className="p-4 bg-muted/50 mx-4 mb-4 rounded-xl">
        <p className="text-xs text-muted-foreground text-center">
          Demo: Enter <span className="font-mono font-bold">1234</span> as OTP
        </p>
      </div>
    </div>
  );
}

export default function VerifyOTPPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <span className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    }>
      <VerifyOTPContent />
    </Suspense>
  );
}
