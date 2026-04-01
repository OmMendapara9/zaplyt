"use client";

import { useState } from "react";
import { ChevronLeft, Check, CreditCard, Wallet, Banknote, Smartphone } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/utils";

const paymentMethods = [
  {
    id: "upi",
    name: "UPI",
    description: "Pay using UPI apps",
    icon: Smartphone,
    options: ["Google Pay", "PhonePe", "Paytm"],
  },
  {
    id: "card",
    name: "Credit/Debit Card",
    description: "Visa, Mastercard, RuPay",
    icon: CreditCard,
  },
  {
    id: "wallet",
    name: "Wallet",
    description: "Paytm, Mobikwik, etc.",
    icon: Wallet,
  },
  {
    id: "cash",
    name: "Cash on Service",
    description: "Pay after service completion",
    icon: Banknote,
  },
];

export default function PaymentPage() {
  const router = useRouter();
  const { items, selectedAddress, schedule, paymentMethod, setPaymentMethod, total, clearCart } =
    useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string>("");
  const [selectedMethod, setSelectedMethod] = useState<string>(paymentMethod || "cash");

  const handlePayment = async () => {
    setError("");
    setIsProcessing(true);

    try {
      // Validate inputs
      if (!items || items.length === 0) {
        throw new Error("No items in cart");
      }
      if (!selectedAddress) {
        throw new Error("Please select an address");
      }
      if (!schedule) {
        throw new Error("Please select a date and time");
      }

      // Create booking
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          services: items.map((item) => ({
            serviceId: item.serviceId,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
          })),
          address: selectedAddress,
          scheduledDate: schedule?.date,
          scheduledTime: schedule?.time,
          totalAmount: total,
          finalAmount: total + 49,
          paymentMethod: selectedMethod,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setPaymentMethod(selectedMethod as "cash" | "upi" | "card" | "wallet");
        
        // Simulate payment processing for non-cash methods
        if (selectedMethod !== "cash") {
          await new Promise((resolve) => setTimeout(resolve, 2000));
        }
        
        clearCart();
        router.push(`/booking/success?id=${data.booking._id}`);
      } else {
        const errorData = await res.json();
        throw new Error(errorData.message || "Booking failed");
      }
    } catch (error) {
      console.error("Payment error:", error);
      setError(error instanceof Error ? error.message : "An error occurred during booking");
      setIsProcessing(false);
    }
  };

  if (isProcessing) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-8">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full mb-6"
        />
        <h2 className="text-xl font-bold text-foreground mb-2">Processing Payment</h2>
        <p className="text-muted-foreground text-center">
          Please wait while we confirm your booking...
        </p>
      </div>
    );
  }

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
        <h1 className="text-lg font-bold">Payment</h1>
      </header>

      {/* Amount */}
      <div className="p-4">
        <div className="text-center py-6">
          <p className="text-muted-foreground mb-1">Amount to Pay</p>
          <p className="text-4xl font-bold text-foreground">{formatPrice(total + 49)}</p>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="mx-4 p-4 bg-red-50 border border-red-200 rounded-lg mb-4">
          <p className="text-red-700 text-sm font-medium">{error}</p>
        </div>
      )}

      {/* Payment methods */}
      <div className="p-4">
        <h2 className="font-semibold text-foreground mb-4">Select Payment Method</h2>
        <div className="space-y-3">
          {paymentMethods.map((method) => (
            <button
              key={method.id}
              onClick={() => setSelectedMethod(method.id)}
              className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-colors text-left ${
                selectedMethod === method.id
                  ? "border-primary bg-primary/5"
                  : "border-border bg-card"
              }`}
            >
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  selectedMethod === method.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                <method.icon className="w-6 h-6" />
              </div>

              <div className="flex-1">
                <p className="font-semibold text-foreground">{method.name}</p>
                <p className="text-sm text-muted-foreground">{method.description}</p>
              </div>

              {selectedMethod === method.id && (
                <Check className="w-5 h-5 text-primary" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Security note */}
      <div className="px-4 mt-4">
        <div className="flex items-center gap-3 p-4 bg-muted rounded-xl">
          <span className="text-2xl">🔒</span>
          <p className="text-sm text-muted-foreground">
            Your payment information is secure. We use industry-standard encryption.
          </p>
        </div>
      </div>

      {/* Bottom button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t border-border">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between mb-3">
            <span className="text-muted-foreground">Total Amount</span>
            <span className="text-xl font-bold">{formatPrice(total + 49)}</span>
          </div>
          <button
            onClick={handlePayment}
            className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-semibold"
          >
            {selectedMethod === "cash" ? "Confirm Booking" : `Pay ${formatPrice(total + 49)}`}
          </button>
        </div>
      </div>
    </div>
  );
}
