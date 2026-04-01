"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Phone,
  User,
  Navigation,
  CheckCircle,
  Play,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { formatPrice } from "@/lib/utils";

interface Booking {
  _id: string;
  user: { name: string; phone: string };
  services: Array<{ name: string; price: number; duration: number }>;
  scheduledDate: string;
  timeSlot: string;
  status: string;
  address: {
    type: string;
    address: string;
    landmark?: string;
    city: string;
    pincode: string;
  };
  totalAmount: number;
  notes?: string;
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ProviderBookingDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();
  const { toast } = useToast();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isOtpDialogOpen, setIsOtpDialogOpen] = useState(false);
  const [otp, setOtp] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const res = await fetch(`/api/bookings/${id}`);
        if (res.ok) {
          setBooking(await res.json());
        }
      } catch (error) {
        console.error("Failed to fetch booking:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBooking();
  }, [id]);

  const handleAction = async (action: string, otpValue?: string) => {
    setIsProcessing(true);
    try {
      const res = await fetch(`/api/provider/bookings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, otp: otpValue }),
      });

      if (res.ok) {
        const data = await res.json();
        setBooking(data.booking);
        setIsOtpDialogOpen(false);
        setOtp("");
        toast({
          title: "Success",
          description: `Booking ${action}ed successfully`,
        });
      } else {
        const error = await res.json();
        throw new Error(error.error);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Action failed",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

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
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-IN", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const openMaps = () => {
    if (booking?.address) {
      const query = encodeURIComponent(
        `${booking.address.address}, ${booking.address.city}, ${booking.address.pincode}`
      );
      window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, "_blank");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Booking not found</p>
      </div>
    );
  }

  const totalDuration = booking.services.reduce((acc, s) => acc + s.duration, 0);

  return (
    <div className="min-h-screen bg-background pb-32">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-card border-b border-border">
        <div className="flex items-center gap-4 p-4">
          <button
            onClick={() => router.back()}
            className="h-10 w-10 rounded-full bg-muted flex items-center justify-center"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="flex-1">
            <h1 className="text-lg font-semibold">Booking Details</h1>
            <p className="text-xs text-muted-foreground">
              ID: {booking._id.slice(-8).toUpperCase()}
            </p>
          </div>
          <span
            className={`text-xs px-3 py-1 rounded-full capitalize ${getStatusColor(
              booking.status
            )}`}
          >
            {booking.status.replace("-", " ")}
          </span>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Customer Info */}
        <div className="bg-card rounded-xl p-4 shadow-sm">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <User className="h-4 w-4" />
            Customer Details
          </h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">{booking.user.name}</p>
              <p className="text-sm text-muted-foreground">{booking.user.phone}</p>
            </div>
            <a
              href={`tel:${booking.user.phone}`}
              className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center"
            >
              <Phone className="h-5 w-5 text-green-600" />
            </a>
          </div>
        </div>

        {/* Schedule */}
        <div className="bg-card rounded-xl p-4 shadow-sm">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Schedule
          </h3>
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>{formatDate(booking.scheduledDate)}</span>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>
                {booking.timeSlot} ({totalDuration} mins)
              </span>
            </div>
          </div>
        </div>

        {/* Address */}
        <div className="bg-card rounded-xl p-4 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Service Address
              </h3>
              <p className="text-sm capitalize text-muted-foreground mb-1">
                {booking.address.type}
              </p>
              <p className="text-sm">{booking.address.address}</p>
              {booking.address.landmark && (
                <p className="text-sm text-muted-foreground">
                  Near {booking.address.landmark}
                </p>
              )}
              <p className="text-sm">
                {booking.address.city} - {booking.address.pincode}
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={openMaps}
              className="gap-1"
            >
              <Navigation className="h-4 w-4" />
              Navigate
            </Button>
          </div>
        </div>

        {/* Services */}
        <div className="bg-card rounded-xl p-4 shadow-sm">
          <h3 className="font-semibold mb-3">Services</h3>
          <div className="space-y-3">
            {booking.services.map((service, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between py-2 border-b border-border last:border-0"
              >
                <div>
                  <p className="font-medium">{service.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {service.duration} mins
                  </p>
                </div>
                <span className="font-medium">{formatPrice(service.price)}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
            <span className="font-semibold">Total Amount</span>
            <span className="font-bold text-lg text-primary">
              {formatPrice(booking.totalAmount)}
            </span>
          </div>
        </div>

        {/* Notes */}
        {booking.notes && (
          <div className="bg-card rounded-xl p-4 shadow-sm">
            <h3 className="font-semibold mb-2">Customer Notes</h3>
            <p className="text-sm text-muted-foreground">{booking.notes}</p>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border p-4">
        {booking.status === "confirmed" && (
          <Button
            className="w-full h-12"
            onClick={() => handleAction("accept")}
            disabled={isProcessing}
          >
            <CheckCircle className="h-5 w-5 mr-2" />
            Accept Booking
          </Button>
        )}

        {booking.status === "assigned" && (
          <Button
            className="w-full h-12 bg-green-600 hover:bg-green-700"
            onClick={() => setIsOtpDialogOpen(true)}
            disabled={isProcessing}
          >
            <Play className="h-5 w-5 mr-2" />
            Start Service
          </Button>
        )}

        {booking.status === "in-progress" && (
          <Button
            className="w-full h-12"
            onClick={() => handleAction("complete")}
            disabled={isProcessing}
          >
            <CheckCircle className="h-5 w-5 mr-2" />
            Complete Service
          </Button>
        )}

        {booking.status === "completed" && (
          <Button
            variant="outline"
            className="w-full h-12"
            onClick={() => router.push("/provider/bookings")}
          >
            Back to Bookings
          </Button>
        )}
      </div>

      {/* OTP Dialog */}
      <Dialog open={isOtpDialogOpen} onOpenChange={setIsOtpDialogOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Enter OTP to Start Service</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground mb-4">
              Please ask the customer for the 4-digit OTP sent to their phone.
            </p>
            <Input
              type="text"
              inputMode="numeric"
              maxLength={4}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              placeholder="Enter 4-digit OTP"
              className="text-center text-2xl tracking-widest h-14"
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsOtpDialogOpen(false);
                setOtp("");
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={() => handleAction("start", otp)}
              disabled={otp.length !== 4 || isProcessing}
            >
              {isProcessing ? "Verifying..." : "Start Service"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
