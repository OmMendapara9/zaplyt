"use client";

import { ChevronLeft, Plus, Minus, Trash2, MapPin, Calendar, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { formatPrice, formatDate, formatTime } from "@/lib/utils";

export default function BookingSummaryPage() {
  const router = useRouter();
  const { items, updateQuantity, removeItem, selectedAddress, schedule, subtotal, total } = useCart();
  const { user, isAuthenticated } = useAuth();

  const defaultAddress = selectedAddress || user?.addresses?.find((a) => a.isDefault);

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <header className="flex items-center gap-4 p-4 border-b border-border">
          <button
            onClick={() => router.back()}
            className="w-10 h-10 bg-muted rounded-full flex items-center justify-center"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-bold">Cart</h1>
        </header>

        <div className="flex-1 flex flex-col items-center justify-center p-8">
          <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
            <span className="text-4xl">🛒</span>
          </div>
          <h2 className="text-xl font-bold text-foreground mb-2">Your cart is empty</h2>
          <p className="text-muted-foreground text-center mb-6">
            Browse our services and add items to your cart
          </p>
          <Link
            href="/home"
            className="px-6 py-3 bg-primary text-primary-foreground rounded-xl font-semibold"
          >
            Browse Services
          </Link>
        </div>
      </div>
    );
  }

  const handleProceed = () => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    if (!defaultAddress) {
      router.push("/booking/address");
      return;
    }
    if (!schedule) {
      router.push("/booking/schedule");
      return;
    }
    router.push("/booking/payment");
  };

  return (
    <div className="min-h-screen bg-background pb-32">
      {/* Header */}
      <header className="sticky top-0 bg-background z-40 flex items-center gap-4 p-4 border-b border-border">
        <button
          onClick={() => router.back()}
          className="w-10 h-10 bg-muted rounded-full flex items-center justify-center"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-bold">Summary</h1>
      </header>

      {/* Cart items */}
      <div className="p-4 space-y-4">
        <h2 className="font-semibold text-foreground">Services ({items.length})</h2>

        {items.map((item) => (
          <div
            key={item.serviceId}
            className="flex gap-4 p-4 bg-card rounded-xl border border-border"
          >
            <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-muted flex-shrink-0">
              <Image
                src={item.image}
                alt={item.name}
                fill
                className="object-cover"
              />
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-foreground mb-1">{item.name}</h3>
              <p className="text-sm text-muted-foreground mb-2">{item.duration}</p>
              <div className="flex items-center justify-between">
                <span className="font-bold">{formatPrice(item.price * item.quantity)}</span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => removeItem(item.serviceId)}
                    className="p-1.5 text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <div className="flex items-center gap-2 bg-muted rounded-lg">
                    <button
                      onClick={() => updateQuantity(item.serviceId, item.quantity - 1)}
                      className="p-1.5"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="font-semibold w-6 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.serviceId, item.quantity + 1)}
                      className="p-1.5"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Address section */}
      <div className="px-4 py-2">
        <Link
          href="/booking/address"
          className="flex items-center gap-4 p-4 bg-card rounded-xl border border-border"
        >
          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
            <MapPin className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-muted-foreground">Service Address</p>
            {defaultAddress ? (
              <p className="font-medium text-foreground truncate">
                {defaultAddress.label}: {defaultAddress.address}
              </p>
            ) : (
              <p className="font-medium text-primary">Add Address</p>
            )}
          </div>
          <ChevronRight className="w-5 h-5 text-muted-foreground" />
        </Link>
      </div>

      {/* Schedule section */}
      <div className="px-4 py-2">
        <Link
          href="/booking/schedule"
          className="flex items-center gap-4 p-4 bg-card rounded-xl border border-border"
        >
          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
            <Calendar className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-muted-foreground">Schedule</p>
            {schedule ? (
              <p className="font-medium text-foreground">
                {formatDate(schedule.date)} at {formatTime(schedule.time)}
              </p>
            ) : (
              <p className="font-medium text-primary">Select Date & Time</p>
            )}
          </div>
          <ChevronRight className="w-5 h-5 text-muted-foreground" />
        </Link>
      </div>

      {/* Price breakdown */}
      <div className="px-4 py-4">
        <div className="p-4 bg-card rounded-xl border border-border space-y-3">
          <h3 className="font-semibold text-foreground">Price Details</h3>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="font-medium">{formatPrice(subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Discount</span>
            <span className="font-medium text-success">-{formatPrice(0)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Service Fee</span>
            <span className="font-medium">{formatPrice(49)}</span>
          </div>
          <div className="border-t border-border pt-3 flex justify-between">
            <span className="font-semibold">Total</span>
            <span className="font-bold text-lg">{formatPrice(total + 49)}</span>
          </div>
        </div>
      </div>

      {/* Bottom button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t border-border">
        <div className="max-w-md mx-auto flex items-center justify-between mb-3">
          <span className="text-muted-foreground">Total Amount</span>
          <span className="text-xl font-bold">{formatPrice(total + 49)}</span>
        </div>
        <button
          onClick={handleProceed}
          className="w-full max-w-md mx-auto bg-primary text-primary-foreground py-4 rounded-xl font-semibold block text-center"
        >
          {!isAuthenticated
            ? "Login to Continue"
            : !defaultAddress
            ? "Add Address"
            : !schedule
            ? "Select Date & Time"
            : "Proceed to Payment"}
        </button>
      </div>
    </div>
  );
}
