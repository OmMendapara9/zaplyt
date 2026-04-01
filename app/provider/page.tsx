"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  Calendar,
  Clock,
  IndianRupee,
  Star,
  TrendingUp,
  ChevronRight,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";

interface Stats {
  totalBookings: number;
  completedBookings: number;
  todayBookings: number;
  pendingBookings: number;
  totalEarnings: number;
  rating: number;
  reviewCount: number;
}

interface Booking {
  _id: string;
  user: { name: string; phone: string };
  services: Array<{ name: string }>;
  scheduledDate: string;
  timeSlot: string;
  status: string;
  address: {
    address: string;
    city: string;
  };
  totalAmount: number;
}

export default function ProviderDashboard() {
  const router = useRouter();
  const { user } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  const [todayBookings, setTodayBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, bookingsRes] = await Promise.all([
          fetch("/api/provider/stats"),
          fetch("/api/provider/bookings?status=confirmed,assigned,in-progress"),
        ]);

        if (statsRes.ok) {
          setStats(await statsRes.json());
        }

        if (bookingsRes.ok) {
          const bookings = await bookingsRes.json();
          const today = new Date().toDateString();
          const filtered = bookings.filter(
            (b: Booking) => new Date(b.scheduledDate).toDateString() === today
          );
          setTodayBookings(filtered.slice(0, 3));
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-blue-100 text-blue-700";
      case "assigned":
        return "bg-yellow-100 text-yellow-700";
      case "in-progress":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="bg-primary px-4 pt-12 pb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-primary-foreground/80 text-sm">Welcome back,</p>
            <h1 className="text-xl font-semibold text-primary-foreground">
              {user?.name || "Provider"}
            </h1>
          </div>
          <div className="flex items-center gap-1 bg-white/20 px-3 py-1.5 rounded-full">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium text-primary-foreground">
              {stats?.rating.toFixed(1) || "0.0"}
            </span>
          </div>
        </div>

        {/* Earnings Card */}
        <div className="bg-card rounded-xl p-4 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Earnings</p>
              <p className="text-2xl font-bold text-foreground flex items-center">
                <IndianRupee className="h-5 w-5" />
                {formatPrice(stats?.totalEarnings || 0).replace("₹", "")}
              </p>
            </div>
            <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="px-4 -mt-2">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-card rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                <Calendar className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats?.todayBookings || 0}</p>
                <p className="text-xs text-muted-foreground">Today</p>
              </div>
            </div>
          </div>
          <div className="bg-card rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center">
                <Clock className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats?.pendingBookings || 0}</p>
                <p className="text-xs text-muted-foreground">Pending</p>
              </div>
            </div>
          </div>
          <div className="bg-card rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats?.completedBookings || 0}</p>
                <p className="text-xs text-muted-foreground">Completed</p>
              </div>
            </div>
          </div>
          <div className="bg-card rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                <Star className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats?.reviewCount || 0}</p>
                <p className="text-xs text-muted-foreground">Reviews</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Today&apos;s Bookings */}
      <div className="px-4 mt-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-foreground">Today&apos;s Bookings</h2>
          <button
            onClick={() => router.push("/provider/bookings")}
            className="text-sm text-primary flex items-center"
          >
            View All
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        {todayBookings.length === 0 ? (
          <div className="bg-card rounded-xl p-8 text-center">
            <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">No bookings for today</p>
          </div>
        ) : (
          <div className="space-y-3">
            {todayBookings.map((booking) => (
              <button
                key={booking._id}
                onClick={() => router.push(`/provider/bookings/${booking._id}`)}
                className="w-full bg-card rounded-xl p-4 shadow-sm text-left"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-medium">{booking.user.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {booking.services.map((s) => s.name).join(", ")}
                    </p>
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded-full capitalize ${getStatusColor(
                      booking.status
                    )}`}
                  >
                    {booking.status.replace("-", " ")}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {booking.timeSlot}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {booking.address.city}
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="px-4 mt-6">
        <h2 className="font-semibold text-foreground mb-3">Quick Actions</h2>
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            className="h-auto py-4 flex-col gap-2"
            onClick={() => router.push("/provider/schedule")}
          >
            <Calendar className="h-5 w-5" />
            <span className="text-sm">View Schedule</span>
          </Button>
          <Button
            variant="outline"
            className="h-auto py-4 flex-col gap-2"
            onClick={() => router.push("/provider/bookings")}
          >
            <Clock className="h-5 w-5" />
            <span className="text-sm">Pending Jobs</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
