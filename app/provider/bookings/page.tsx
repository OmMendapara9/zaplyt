"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Calendar, Clock, MapPin, Phone } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { formatPrice } from "@/lib/utils";

interface Booking {
  _id: string;
  user: { name: string; phone: string };
  services: Array<{ name: string; price: number }>;
  scheduledDate: string;
  timeSlot: string;
  status: string;
  address: {
    address: string;
    city: string;
    pincode: string;
  };
  totalAmount: number;
}

export default function ProviderBookingsPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("pending");

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-blue-100 text-blue-700";
      case "assigned":
        return "bg-yellow-100 text-yellow-700";
      case "in-progress":
        return "bg-green-100 text-green-700";
      case "completed":
        return "bg-gray-100 text-gray-700";
      case "cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const filterBookings = (tab: string) => {
    switch (tab) {
      case "pending":
        return bookings.filter((b) =>
          ["confirmed", "assigned"].includes(b.status)
        );
      case "ongoing":
        return bookings.filter((b) => b.status === "in-progress");
      case "completed":
        return bookings.filter((b) => b.status === "completed");
      default:
        return bookings;
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-IN", {
      weekday: "short",
      day: "numeric",
      month: "short",
    });
  };

  const renderBookingCard = (booking: Booking) => (
    <button
      key={booking._id}
      onClick={() => router.push(`/provider/bookings/${booking._id}`)}
      className="w-full bg-card rounded-xl p-4 shadow-sm text-left mb-3"
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold">{booking.user.name}</h3>
          <a
            href={`tel:${booking.user.phone}`}
            className="text-sm text-primary flex items-center gap-1"
            onClick={(e) => e.stopPropagation()}
          >
            <Phone className="h-3 w-3" />
            {booking.user.phone}
          </a>
        </div>
        <span
          className={`text-xs px-2 py-1 rounded-full capitalize ${getStatusColor(
            booking.status
          )}`}
        >
          {booking.status.replace("-", " ")}
        </span>
      </div>

      <div className="space-y-2 mb-3">
        {booking.services.map((service, idx) => (
          <div key={idx} className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">{service.name}</span>
            <span className="font-medium">{formatPrice(service.price)}</span>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-4 text-sm text-muted-foreground border-t border-border pt-3">
        <span className="flex items-center gap-1">
          <Calendar className="h-4 w-4" />
          {formatDate(booking.scheduledDate)}
        </span>
        <span className="flex items-center gap-1">
          <Clock className="h-4 w-4" />
          {booking.timeSlot}
        </span>
      </div>

      <div className="flex items-start gap-2 mt-2 text-sm text-muted-foreground">
        <MapPin className="h-4 w-4 flex-shrink-0 mt-0.5" />
        <span>
          {booking.address.address}, {booking.address.city} -{" "}
          {booking.address.pincode}
        </span>
      </div>

      <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
        <span className="text-sm text-muted-foreground">Total Amount</span>
        <span className="font-semibold text-primary">
          {formatPrice(booking.totalAmount)}
        </span>
      </div>
    </button>
  );

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
          <h1 className="text-lg font-semibold">My Bookings</h1>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="sticky top-[72px] z-10 bg-background px-4 pt-4">
          <TabsList className="w-full">
            <TabsTrigger value="pending" className="flex-1">
              Pending ({filterBookings("pending").length})
            </TabsTrigger>
            <TabsTrigger value="ongoing" className="flex-1">
              Ongoing ({filterBookings("ongoing").length})
            </TabsTrigger>
            <TabsTrigger value="completed" className="flex-1">
              Done ({filterBookings("completed").length})
            </TabsTrigger>
          </TabsList>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            <TabsContent value="pending" className="px-4 mt-4">
              {filterBookings("pending").length === 0 ? (
                <div className="text-center py-12">
                  <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">No pending bookings</p>
                </div>
              ) : (
                filterBookings("pending").map(renderBookingCard)
              )}
            </TabsContent>

            <TabsContent value="ongoing" className="px-4 mt-4">
              {filterBookings("ongoing").length === 0 ? (
                <div className="text-center py-12">
                  <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">No ongoing bookings</p>
                </div>
              ) : (
                filterBookings("ongoing").map(renderBookingCard)
              )}
            </TabsContent>

            <TabsContent value="completed" className="px-4 mt-4">
              {filterBookings("completed").length === 0 ? (
                <div className="text-center py-12">
                  <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">No completed bookings</p>
                </div>
              ) : (
                filterBookings("completed").map(renderBookingCard)
              )}
            </TabsContent>
          </>
        )}
      </Tabs>
    </div>
  );
}
