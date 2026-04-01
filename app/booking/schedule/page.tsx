"use client";

import { useState } from "react";
import { ChevronLeft, Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { format, addDays, isSameDay } from "date-fns";
import { useCart } from "@/context/CartContext";

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

export default function SchedulePage() {
  const router = useRouter();
  const { schedule, setSchedule } = useCart();
  const [selectedDate, setSelectedDate] = useState<Date>(
    schedule?.date || addDays(new Date(), 1)
  );
  const [selectedTime, setSelectedTime] = useState<string>(schedule?.time || "");

  // Generate next 7 days
  const dates = Array.from({ length: 7 }, (_, i) => addDays(new Date(), i + 1));

  const handleConfirm = () => {
    if (selectedDate && selectedTime) {
      setSchedule({ date: selectedDate, time: selectedTime });
      router.push("/booking/summary");
    }
  };

  const isTimeSlotAvailable = (slot: string) => {
    // For demo, all slots are available
    // In production, check against provider availability
    return true;
  };

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
        <h1 className="text-lg font-bold">Select Date & Time</h1>
      </header>

      {/* Date selection */}
      <div className="p-4">
        <h2 className="font-semibold text-foreground mb-4">Select Date</h2>
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
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
                <span className="text-xs opacity-70">
                  {format(date, "EEE")}
                </span>
                <span className="text-xl font-bold">{format(date, "d")}</span>
                <span className="text-xs opacity-70">
                  {format(date, "MMM")}
                </span>
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
            const isAvailable = isTimeSlotAvailable(slot.start);

            return (
              <button
                key={slot.start}
                onClick={() => isAvailable && setSelectedTime(slot.start)}
                disabled={!isAvailable}
                className={`relative py-3 px-4 rounded-xl font-medium text-sm transition-colors ${
                  isSelected
                    ? "bg-primary text-primary-foreground"
                    : isAvailable
                    ? "bg-muted text-foreground hover:bg-muted/80"
                    : "bg-muted/50 text-muted-foreground cursor-not-allowed"
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

      {/* Info note */}
      <div className="px-4">
        <div className="p-4 bg-primary/5 rounded-xl">
          <p className="text-sm text-muted-foreground">
            Service provider will arrive within 30 minutes of the selected time slot. 
            You can reschedule up to 2 hours before the appointment.
          </p>
        </div>
      </div>

      {/* Bottom button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t border-border">
        <button
          onClick={handleConfirm}
          disabled={!selectedDate || !selectedTime}
          className="w-full max-w-md mx-auto bg-primary text-primary-foreground py-4 rounded-xl font-semibold disabled:opacity-50 block"
        >
          Confirm Schedule
        </button>
      </div>
    </div>
  );
}
