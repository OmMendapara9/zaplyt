"use client";

import { use, useState } from "react";
import useSWR from "swr";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  Calendar,
  Clock,
  MapPin,
  Phone,
  Star,
  RefreshCw,
  X,
  CheckCircle,
} from "lucide-react";
import { formatPrice, formatDate, formatTime, cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface Booking {
  _id: string;
  services: { serviceId: string; name: string; price: number; quantity: number }[];
  address: { label: string; address: string; city: string; pincode: string };
  scheduledDate: string;
  scheduledTime: string;
  status: "pending" | "accepted" | "in-progress" | "completed" | "cancelled";
  totalAmount: number;
  finalAmount: number;
  paymentMethod: string;
  paymentStatus: string;
  rating?: number;
  feedback?: string;
  createdAt: string;
}

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  accepted: "bg-blue-100 text-blue-800",
  "in-progress": "bg-purple-100 text-purple-800",
  completed: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

const statusLabels = {
  pending: "Pending Confirmation",
  accepted: "Accepted",
  "in-progress": "Service In Progress",
  completed: "Completed",
  cancelled: "Cancelled",
};

export default function BookingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { data, isLoading, mutate } = useSWR<{ booking: Booking }>(
    `/api/bookings/${id}`,
    fetcher
  );
  const [showCancelSheet, setShowCancelSheet] = useState(false);
  const [showRatingSheet, setShowRatingSheet] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const booking = data?.booking;

  const handleCancel = async () => {
    if (!cancelReason) return;
    setIsSubmitting(true);

    try {
      const res = await fetch(`/api/bookings/${id}/cancel`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: cancelReason }),
      });

      if (res.ok) {
        mutate();
        setShowCancelSheet(false);
      }
    } catch (error) {
      console.error("Cancel error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRating = async () => {
    if (!rating) return;
    setIsSubmitting(true);

    try {
      const res = await fetch(`/api/bookings/${id}/feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating, feedback }),
      });

      if (res.ok) {
        mutate();
        setShowRatingSheet(false);
      }
    } catch (error) {
      console.error("Rating error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <span className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-8">
        <h2 className="text-xl font-bold mb-2">Booking not found</h2>
        <button
          onClick={() => router.push("/bookings")}
          className="text-primary font-medium"
        >
          Go back to bookings
        </button>
      </div>
    );
  }

  const canCancel = ["pending", "accepted"].includes(booking.status);
  const canReschedule = ["pending", "accepted"].includes(booking.status);
  const canRate = booking.status === "completed" && !booking.rating;

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="sticky top-0 bg-background z-40 flex items-center gap-4 p-4 border-b border-border">
        <button
          onClick={() => router.back()}
          className="w-10 h-10 bg-muted rounded-full flex items-center justify-center"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-bold">Booking Details</h1>
      </header>

      {/* Status */}
      <div className="p-4">
        <div
          className={cn(
            "flex items-center justify-center gap-2 py-3 rounded-xl",
            statusColors[booking.status]
          )}
        >
          {booking.status === "completed" ? (
            <CheckCircle className="w-5 h-5" />
          ) : booking.status === "cancelled" ? (
            <X className="w-5 h-5" />
          ) : (
            <Clock className="w-5 h-5" />
          )}
          <span className="font-semibold">{statusLabels[booking.status]}</span>
        </div>
      </div>

      {/* Services */}
      <div className="px-4 py-2">
        <div className="bg-card rounded-xl border border-border p-4">
          <h3 className="font-semibold text-foreground mb-3">Services</h3>
          <div className="space-y-3">
            {booking.services.map((service, i) => (
              <div key={i} className="flex justify-between">
                <div>
                  <p className="font-medium text-foreground">{service.name}</p>
                  <p className="text-sm text-muted-foreground">
                    Qty: {service.quantity}
                  </p>
                </div>
                <span className="font-semibold">
                  {formatPrice(service.price * service.quantity)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Schedule */}
      <div className="px-4 py-2">
        <div className="bg-card rounded-xl border border-border p-4 space-y-3">
          <h3 className="font-semibold text-foreground">Schedule</h3>
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-primary" />
            <span>{formatDate(booking.scheduledDate)}</span>
          </div>
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-primary" />
            <span>{formatTime(booking.scheduledTime)}</span>
          </div>
        </div>
      </div>

      {/* Address */}
      <div className="px-4 py-2">
        <div className="bg-card rounded-xl border border-border p-4">
          <h3 className="font-semibold text-foreground mb-3">Service Address</h3>
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-foreground">{booking.address.label}</p>
              <p className="text-muted-foreground">{booking.address.address}</p>
              <p className="text-muted-foreground">
                {booking.address.city} - {booking.address.pincode}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Payment */}
      <div className="px-4 py-2">
        <div className="bg-card rounded-xl border border-border p-4">
          <h3 className="font-semibold text-foreground mb-3">Payment Details</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Payment Method</span>
              <span className="font-medium capitalize">{booking.paymentMethod}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Payment Status</span>
              <span
                className={cn(
                  "font-medium capitalize",
                  booking.paymentStatus === "paid"
                    ? "text-success"
                    : "text-yellow-600"
                )}
              >
                {booking.paymentStatus}
              </span>
            </div>
            <div className="flex justify-between pt-2 border-t border-border">
              <span className="font-semibold">Total Amount</span>
              <span className="font-bold text-lg">
                {formatPrice(booking.finalAmount)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Rating (if completed) */}
      {booking.rating && (
        <div className="px-4 py-2">
          <div className="bg-card rounded-xl border border-border p-4">
            <h3 className="font-semibold text-foreground mb-3">Your Rating</h3>
            <div className="flex items-center gap-1 mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={cn(
                    "w-6 h-6",
                    star <= booking.rating!
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-muted-foreground"
                  )}
                />
              ))}
            </div>
            {booking.feedback && (
              <p className="text-muted-foreground">{booking.feedback}</p>
            )}
          </div>
        </div>
      )}

      {/* Action buttons */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t border-border">
        <div className="flex gap-3 max-w-md mx-auto">
          {canCancel && (
            <button
              onClick={() => setShowCancelSheet(true)}
              className="flex-1 py-3 border-2 border-destructive text-destructive rounded-xl font-semibold"
            >
              Cancel
            </button>
          )}
          {canReschedule && (
            <button
              onClick={() => router.push(`/bookings/${id}/reschedule`)}
              className="flex-1 py-3 bg-primary text-primary-foreground rounded-xl font-semibold flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Reschedule
            </button>
          )}
          {canRate && (
            <button
              onClick={() => setShowRatingSheet(true)}
              className="flex-1 py-3 bg-primary text-primary-foreground rounded-xl font-semibold flex items-center justify-center gap-2"
            >
              <Star className="w-4 h-4" />
              Rate Service
            </button>
          )}
          <a
            href="tel:+911234567890"
            className="py-3 px-4 bg-muted rounded-xl flex items-center justify-center"
          >
            <Phone className="w-5 h-5" />
          </a>
        </div>
      </div>

      {/* Cancel bottom sheet */}
      <AnimatePresence>
        {showCancelSheet && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50"
              onClick={() => setShowCancelSheet(false)}
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              className="fixed bottom-0 left-0 right-0 bg-background rounded-t-3xl z-50 p-4"
            >
              <div className="flex justify-center pb-2">
                <div className="w-10 h-1 bg-muted-foreground/30 rounded-full" />
              </div>
              <h2 className="text-xl font-bold mb-4">Cancel Booking</h2>
              <p className="text-muted-foreground mb-4">
                Please select a reason for cancellation:
              </p>
              <div className="space-y-2 mb-4">
                {[
                  "Change of plans",
                  "Found better option",
                  "Provider not responding",
                  "Booked by mistake",
                  "Other reason",
                ].map((reason) => (
                  <button
                    key={reason}
                    onClick={() => setCancelReason(reason)}
                    className={cn(
                      "w-full p-3 rounded-xl border-2 text-left transition-colors",
                      cancelReason === reason
                        ? "border-primary bg-primary/5"
                        : "border-border"
                    )}
                  >
                    {reason}
                  </button>
                ))}
              </div>
              <button
                onClick={handleCancel}
                disabled={!cancelReason || isSubmitting}
                className="w-full bg-destructive text-destructive-foreground py-4 rounded-xl font-semibold disabled:opacity-50"
              >
                {isSubmitting ? "Cancelling..." : "Confirm Cancellation"}
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Rating bottom sheet */}
      <AnimatePresence>
        {showRatingSheet && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50"
              onClick={() => setShowRatingSheet(false)}
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              className="fixed bottom-0 left-0 right-0 bg-background rounded-t-3xl z-50 p-4"
            >
              <div className="flex justify-center pb-2">
                <div className="w-10 h-1 bg-muted-foreground/30 rounded-full" />
              </div>
              <h2 className="text-xl font-bold mb-4 text-center">
                Rate Your Experience
              </h2>
              <div className="flex justify-center gap-2 mb-6">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button key={star} onClick={() => setRating(star)}>
                    <Star
                      className={cn(
                        "w-10 h-10 transition-colors",
                        star <= rating
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-muted-foreground"
                      )}
                    />
                  </button>
                ))}
              </div>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Tell us about your experience (optional)"
                rows={3}
                className="w-full px-4 py-3 bg-muted rounded-xl border border-border outline-none resize-none mb-4"
              />
              <button
                onClick={handleRating}
                disabled={!rating || isSubmitting}
                className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-semibold disabled:opacity-50"
              >
                {isSubmitting ? "Submitting..." : "Submit Rating"}
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
