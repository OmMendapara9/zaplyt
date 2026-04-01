"use client";

import { useState } from "react";
import { ChevronLeft, MapPin, Plus, Check, Home, Briefcase, MoreHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";

const addressTypes = [
  { value: "Home", icon: Home },
  { value: "Work", icon: Briefcase },
  { value: "Other", icon: MoreHorizontal },
];

export default function AddressPage() {
  const router = useRouter();
  const { user, refreshUser } = useAuth();
  const { setAddress, selectedAddress } = useCart();
  const [showAddForm, setShowAddForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    label: "Home" as "Home" | "Work" | "Other",
    address: "",
    landmark: "",
    city: "",
    pincode: "",
  });

  const addresses = user?.addresses || [];

  const handleSelectAddress = (addr: typeof addresses[0]) => {
    setAddress({
      id: addr.id,
      label: addr.label,
      address: addr.address,
      landmark: addr.landmark,
      city: addr.city,
      pincode: addr.pincode,
    });
    router.push("/booking/summary");
  };

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.address || !formData.city || !formData.pincode) return;

    setIsLoading(true);
    try {
      const res = await fetch("/api/users/addresses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        const data = await res.json();
        await refreshUser();
        setAddress({
          id: data.address.id,
          label: data.address.label,
          address: data.address.address,
          landmark: data.address.landmark,
          city: data.address.city,
          pincode: data.address.pincode,
        });
        setShowAddForm(false);
        router.push("/booking/summary");
      }
    } catch (error) {
      console.error("Failed to add address:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 bg-background z-40 flex items-center gap-4 p-4 border-b border-border">
        <button
          onClick={() => router.back()}
          className="w-10 h-10 bg-muted rounded-full flex items-center justify-center"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-bold">Select Address</h1>
      </header>

      {/* Address list */}
      <div className="p-4 space-y-4">
        {addresses.map((addr) => (
          <button
            key={addr.id}
            onClick={() => handleSelectAddress(addr)}
            className={`w-full flex items-start gap-4 p-4 bg-card rounded-xl border-2 transition-colors text-left ${
              selectedAddress?.id === addr.id
                ? "border-primary"
                : "border-border"
            }`}
          >
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                selectedAddress?.id === addr.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {addr.label === "Home" ? (
                <Home className="w-5 h-5" />
              ) : addr.label === "Work" ? (
                <Briefcase className="w-5 h-5" />
              ) : (
                <MapPin className="w-5 h-5" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-foreground">{addr.label}</span>
                {addr.isDefault && (
                  <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs font-medium rounded">
                    Default
                  </span>
                )}
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {addr.address}
                {addr.landmark && `, ${addr.landmark}`}
              </p>
              <p className="text-sm text-muted-foreground">
                {addr.city} - {addr.pincode}
              </p>
            </div>

            {selectedAddress?.id === addr.id && (
              <Check className="w-5 h-5 text-primary flex-shrink-0" />
            )}
          </button>
        ))}

        {/* Add new address button */}
        <button
          onClick={() => setShowAddForm(true)}
          className="w-full flex items-center justify-center gap-2 p-4 border-2 border-dashed border-border rounded-xl text-primary font-medium"
        >
          <Plus className="w-5 h-5" />
          Add New Address
        </button>
      </div>

      {/* Add address bottom sheet */}
      <AnimatePresence>
        {showAddForm && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50"
              onClick={() => setShowAddForm(false)}
            />

            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 bg-background rounded-t-3xl z-50 max-h-[90vh] overflow-auto"
            >
              <div className="flex justify-center pt-3 pb-2">
                <div className="w-10 h-1 bg-muted-foreground/30 rounded-full" />
              </div>

              <form onSubmit={handleAddAddress} className="p-4 space-y-4">
                <h2 className="text-xl font-bold text-foreground">Add New Address</h2>

                {/* Address type */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Address Type
                  </label>
                  <div className="flex gap-3">
                    {addressTypes.map((type) => (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() =>
                          setFormData({ ...formData, label: type.value as "Home" | "Work" | "Other" })
                        }
                        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 transition-colors ${
                          formData.label === type.value
                            ? "border-primary bg-primary/5 text-primary"
                            : "border-border text-foreground"
                        }`}
                      >
                        <type.icon className="w-4 h-4" />
                        <span className="font-medium">{type.value}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Address */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Complete Address *
                  </label>
                  <textarea
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                    placeholder="House/Flat No., Building, Street, Area"
                    rows={3}
                    className="w-full px-4 py-3 bg-muted rounded-xl border border-border outline-none focus:border-primary resize-none"
                    required
                  />
                </div>

                {/* Landmark */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Landmark (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.landmark}
                    onChange={(e) =>
                      setFormData({ ...formData, landmark: e.target.value })
                    }
                    placeholder="Near hospital, school, etc."
                    className="w-full px-4 py-3 bg-muted rounded-xl border border-border outline-none focus:border-primary"
                  />
                </div>

                {/* City & Pincode */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      City *
                    </label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) =>
                        setFormData({ ...formData, city: e.target.value })
                      }
                      placeholder="City"
                      className="w-full px-4 py-3 bg-muted rounded-xl border border-border outline-none focus:border-primary"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      Pincode *
                    </label>
                    <input
                      type="text"
                      value={formData.pincode}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          pincode: e.target.value.replace(/\D/g, "").slice(0, 6),
                        })
                      }
                      placeholder="6-digit pincode"
                      className="w-full px-4 py-3 bg-muted rounded-xl border border-border outline-none focus:border-primary"
                      required
                    />
                  </div>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isLoading || !formData.address || !formData.city || !formData.pincode}
                  className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-semibold disabled:opacity-50 mt-4"
                >
                  {isLoading ? "Saving..." : "Save Address"}
                </button>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
