"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Check } from "lucide-react";
import { format, addDays, isSameDay } from "date-fns";
import { motion } from "framer-motion";

const timeSlots = [
  { start: "09:00", label: "9:00 AM" },
  { start: "10:00", label: "10:00 AM" },
  { start: "11:00", label: "11:00 AM" },
  { start: "12:00", label: "12:00 PM" },
  { start: "13:00", label: "1:00 PM" },
  { start: "14:00", label: "2:00 PM" },
  { start: "15:00", label: "3:00 PM" },
  { start: "16:00", label: "4:00 PM" },
  { start: "17:00", label: "5:00 PM" },
  { start: "18:00", label: "6:00 PM" },
];

export default function ReschedulePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState<Date>(addDays(new Date(), 1));
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const dates = Array.from({ length: 7 }, (_, i) => addDays(new Date(), i + 1));

  const handleReschedule = async () => {
    if (!selectedDate || !selectedTime) return;
    setIsSubmitting(true);

    try {
      const res = await fetch(`/api/bookings/${id}/reschedule`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scheduledDate: selectedDate,
          scheduledTime: selectedTime,
        }),
      });

      if (res.ok) {
        setShowSuccess(true);
        setTimeout(() => {
          router.push(`/bookings/${id}`);
        }, 2000);
      }
    } catch (error) {
      console.error("Reschedule error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-20 h-20 bg-success rounded-full flex items-center justify-center mb-6"
        >
          <Check className="w-10 h-10 text-success-foreground" />
        </motion.div>
        <h2 className="text-xl font-bold text-foreground mb-2">
          Booking Rescheduled!
        </h2>
        <p className="text-muted-foreground text-center">
          Your new appointment is on{" "}
          {format(selectedDate, "MMMM d, yyyy")} at{" "}
          {timeSlots.find((t) => t.start === selectedTime)?.label}
        </p>
      </div>
    );
  }

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
        <h1 className="text-lg font-bold">Reschedule Booking</h1>
      </header>

      {/* Date selection */}
      <div className="p-4">
        <h2 className="font-semibold text-foreground mb-4">Select New Date</h2>
        <div className="flex gap-3 overflow-x-auto pb-2">
          {dates.map((date) => {
            const isSelected = isSameDay(date, selectedDate);
            return (
              <button
                key={date.toISOString()}
                onClick={() => setSelectedDate(date)}
                className={`flex flex-col items-center px-4 py-3 rounded-xl min-w-[70px] transition-colors ${
                  isSelected
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-foreground"
                }`}
              >
                <span className="text-xs opacity-70">{format(date, "EEE")}</span>
                <span className="text-xl font-bold">{format(date, "d")}</span>
                <span className="text-xs opacity-70">{format(date, "MMM")}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Time selection */}
      <div className="p-4">
        <h2 className="font-semibold text-foreground mb-4">Select Time Slot</h2>
        <div className="grid grid-cols-3 gap-3">
          {timeSlots.map((slot) => {
            const isSelected = selectedTime === slot.start;
            return (
              <button
                key={slot.start}
                onClick={() => setSelectedTime(slot.start)}
                className={`relative py-3 px-4 rounded-xl font-medium text-sm transition-colors ${
                  isSelected
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-foreground"
                }`}
              >
                {slot.label}
                {isSelected && (
                  <Check className="absolute top-1 right-1 w-4 h-4" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t border-border">
        <button
          onClick={handleReschedule}
          disabled={!selectedDate || !selectedTime || isSubmitting}
          className="w-full max-w-md mx-auto bg-primary text-primary-foreground py-4 rounded-xl font-semibold disabled:opacity-50 block"
        >
          {isSubmitting ? "Rescheduling..." : "Confirm New Schedule"}
        </button>
      </div>
    </div>
  );
}
