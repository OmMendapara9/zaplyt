"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ChevronLeft, ChevronRight, Clock, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Booking {
  _id: string;
  user: { name: string };
  services: Array<{ name: string }>;
  timeSlot: string;
  status: string;
  address: { city: string };
}

export default function ProviderSchedulePage() {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const getDaysInWeek = (date: Date) => {
    const days = [];
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay());
    
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      days.push(day);
    }
    return days;
  };

  const [weekDays, setWeekDays] = useState(getDaysInWeek(new Date()));

  useEffect(() => {
    const fetchBookings = async () => {
      setIsLoading(true);
      try {
        const res = await fetch("/api/provider/bookings");
        if (res.ok) {
          setBookings(await res.json());
        }
      } catch (error) {
        console.error("Failed to fetch bookings:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const navigateWeek = (direction: "prev" | "next") => {
    const newDate = new Date(weekDays[0]);
    newDate.setDate(newDate.getDate() + (direction === "next" ? 7 : -7));
    setWeekDays(getDaysInWeek(newDate));
    setSelectedDate(newDate);
  };

  const getBookingsForDate = (date: Date) => {
    return bookings.filter((b) => {
      const bookingDate = new Date(b.scheduledDate as unknown as string);
      return (
        bookingDate.toDateString() === date.toDateString() &&
        ["confirmed", "assigned", "in-progress"].includes(b.status)
      );
    });
  };

  const isToday = (date: Date) => {
    return date.toDateString() === new Date().toDateString();
  };

  const isSelected = (date: Date) => {
    return date.toDateString() === selectedDate.toDateString();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "border-l-blue-500";
      case "assigned":
        return "border-l-yellow-500";
      case "in-progress":
        return "border-l-green-500";
      default:
        return "border-l-gray-500";
    }
  };

  const dayBookings = getBookingsForDate(selectedDate);

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-card border-b border-border">
        <div className="flex items-center gap-4 p-4">
          <button
            onClick={() => router.back()}
            className="h-10 w-10 rounded-full bg-muted flex items-center justify-center"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-lg font-semibold">My Schedule</h1>
        </div>
      </div>

      {/* Calendar Navigation */}
      <div className="px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <Button variant="ghost" size="icon" onClick={() => navigateWeek("prev")}>
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <span className="font-medium">
            {weekDays[0].toLocaleDateString("en-IN", { month: "long", year: "numeric" })}
          </span>
          <Button variant="ghost" size="icon" onClick={() => navigateWeek("next")}>
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>

        {/* Week Days */}
        <div className="grid grid-cols-7 gap-1">
          {weekDays.map((day, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedDate(day)}
              className={`flex flex-col items-center py-2 rounded-lg transition-colors ${
                isSelected(day)
                  ? "bg-primary text-primary-foreground"
                  : isToday(day)
                  ? "bg-primary/10 text-primary"
                  : "hover:bg-muted"
              }`}
            >
              <span className="text-xs opacity-80">
                {day.toLocaleDateString("en-IN", { weekday: "short" })}
              </span>
              <span className="text-lg font-semibold">{day.getDate()}</span>
              {getBookingsForDate(day).length > 0 && (
                <span className="h-1.5 w-1.5 rounded-full bg-current mt-1" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Selected Date Bookings */}
      <div className="px-4">
        <h2 className="font-semibold mb-3">
          {selectedDate.toLocaleDateString("en-IN", {
            weekday: "long",
            day: "numeric",
            month: "long",
          })}
        </h2>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : dayBookings.length === 0 ? (
          <div className="bg-card rounded-xl p-8 text-center">
            <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">No bookings for this day</p>
          </div>
        ) : (
          <div className="space-y-3">
            {dayBookings.map((booking) => (
              <button
                key={booking._id}
                onClick={() => router.push(`/provider/bookings/${booking._id}`)}
                className={`w-full bg-card rounded-xl p-4 shadow-sm text-left border-l-4 ${getStatusColor(
                  booking.status
                )}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold">{booking.timeSlot}</span>
                  <span className="text-xs px-2 py-1 bg-muted rounded-full capitalize">
                    {booking.status.replace("-", " ")}
                  </span>
                </div>
                <p className="font-medium">{booking.user.name}</p>
                <p className="text-sm text-muted-foreground">
                  {booking.services.map((s) => s.name).join(", ")}
                </p>
                <div className="flex items-center gap-1 text-sm text-muted-foreground mt-2">
                  <MapPin className="h-3 w-3" />
                  {booking.address.city}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
