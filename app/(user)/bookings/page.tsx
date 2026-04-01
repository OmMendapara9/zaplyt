"use client";

import { useState } from "react";
import useSWR from "swr";
import Link from "next/link";
import { Calendar, Clock, MapPin, ChevronRight } from "lucide-react";
import { formatPrice, formatDate, formatTime } from "@/lib/utils";
import { cn } from "@/lib/utils";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface Booking {
  _id: string;
  services: { name: string; price: number; quantity: number }[];
  address: { label: string; address: string };
  scheduledDate: string;
  scheduledTime: string;
  status: "pending" | "accepted" | "in-progress" | "completed" | "cancelled";
  finalAmount: number;
  rating?: number;
}

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  accepted: "bg-blue-100 text-blue-800",
  "in-progress": "bg-purple-100 text-purple-800",
  completed: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

const statusLabels = {
  pending: "Pending",
  accepted: "Accepted",
  "in-progress": "In Progress",
  completed: "Completed",
  cancelled: "Cancelled",
};

export default function BookingsPage() {
  const [activeTab, setActiveTab] = useState<"upcoming" | "previous">("upcoming");
  const { data, isLoading } = useSWR<{ bookings: Booking[] }>(
    `/api/bookings?type=${activeTab}`,
    fetcher
  );

  const bookings = data?.bookings || [];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-primary-foreground p-4">
        <h1 className="text-xl font-bold">My Bookings</h1>
      </header>

      {/* Tabs */}
      <div className="flex border-b border-border">
        <button
          onClick={() => setActiveTab("upcoming")}
          className={cn(
            "flex-1 py-4 text-sm font-semibold transition-colors relative",
            activeTab === "upcoming"
              ? "text-primary"
              : "text-muted-foreground"
          )}
        >
          Upcoming
          {activeTab === "upcoming" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
          )}
        </button>
        <button
          onClick={() => setActiveTab("previous")}
          className={cn(
            "flex-1 py-4 text-sm font-semibold transition-colors relative",
            activeTab === "previous"
              ? "text-primary"
              : "text-muted-foreground"
          )}
        >
          Previous
          {activeTab === "previous" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
          )}
        </button>
      </div>

      {/* Bookings list */}
      <div className="p-4 space-y-4">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <span className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
          </div>
        ) : bookings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-4">
              <Calendar className="w-10 h-10 text-muted-foreground" />
            </div>
            <h2 className="text-lg font-semibold text-foreground mb-2">
              No {activeTab} bookings
            </h2>
            <p className="text-muted-foreground text-center mb-6">
              {activeTab === "upcoming"
                ? "Book a service to get started"
                : "Your completed bookings will appear here"}
            </p>
            {activeTab === "upcoming" && (
              <Link
                href="/home"
                className="px-6 py-3 bg-primary text-primary-foreground rounded-xl font-semibold"
              >
                Browse Services
              </Link>
            )}
          </div>
        ) : (
          bookings.map((booking) => (
            <Link
              key={booking._id}
              href={`/bookings/${booking._id}`}
              className="block bg-card rounded-xl border border-border overflow-hidden"
            >
              <div className="p-4">
                {/* Status badge */}
                <div className="flex items-center justify-between mb-3">
                  <span
                    className={cn(
                      "px-3 py-1 rounded-full text-xs font-semibold",
                      statusColors[booking.status]
                    )}
                  >
                    {statusLabels[booking.status]}
                  </span>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </div>

                {/* Services */}
                <h3 className="font-semibold text-foreground mb-2">
                  {booking.services.map((s) => s.name).join(", ")}
                </h3>

                {/* Details */}
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(booking.scheduledDate)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{formatTime(booking.scheduledTime)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span className="truncate">
                      {booking.address.label}: {booking.address.address}
                    </span>
                  </div>
                </div>

                {/* Price */}
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                  <span className="text-muted-foreground">Total Amount</span>
                  <span className="font-bold text-foreground">
                    {formatPrice(booking.finalAmount)}
                  </span>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
