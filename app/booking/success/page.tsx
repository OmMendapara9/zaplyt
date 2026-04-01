"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle, Calendar, MapPin, Clock } from "lucide-react";
import Link from "next/link";

function SuccessContent() {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("id");

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Success animation */}
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
          className="w-24 h-24 bg-success rounded-full flex items-center justify-center mb-6"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
                    
          >
            <CheckCircle className="w-12 h-12 text-success-foreground" />
          </motion.div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-2xl font-bold text-foreground mb-2 text-center"
        >
          Booking Confirmed!
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="text-muted-foreground text-center mb-8"
        >
          Your service has been successfully booked
        </motion.p>

        {/* Booking details card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="w-full max-w-sm bg-card rounded-2xl border border-border p-6 space-y-4"
        >
          <div className="text-center pb-4 border-b border-border">
            <p className="text-sm text-muted-foreground mb-1">Booking ID</p>
            <p className="font-mono font-bold text-foreground">
              #{bookingId?.slice(-8).toUpperCase() || "DEMO1234"}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <Calendar className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Date & Time</p>
              <p className="font-medium text-foreground">Tomorrow, 10:00 AM</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <MapPin className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Service Location</p>
              <p className="font-medium text-foreground">Your selected address</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <Clock className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <p className="font-medium text-success">Confirmed</p>
            </div>
          </div>
        </motion.div>

        {/* Info note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-sm text-muted-foreground text-center mt-6 max-w-sm"
        >
          Our service provider will contact you 30 minutes before the scheduled time.
        </motion.p>
      </div>

      {/* Bottom buttons */}
      <div className="p-4 space-y-3">
        <Link
          href={`/bookings/${bookingId || "demo"}`}
          className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-semibold block text-center"
        >
          View Booking Details
        </Link>
        <Link
          href="/home"
          className="w-full bg-muted text-foreground py-4 rounded-xl font-semibold block text-center"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}

export default function BookingSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <span className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
