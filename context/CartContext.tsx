"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface CartItem {
  serviceId: string;
  name: string;
  price: number;
  quantity: number;
  duration: string;
  image: string;
  category: string;
}

export interface SelectedAddress {
  id: string;
  label: string;
  address: string;
  landmark?: string;
  city: string;
  pincode: string;
}

export interface ScheduleInfo {
  date: Date;
  time: string;
}

interface CartContextType {
  items: CartItem[];
  selectedAddress: SelectedAddress | null;
  schedule: ScheduleInfo | null;
  paymentMethod: "cash" | "upi" | "card" | "wallet";
  addItem: (item: CartItem) => void;
  removeItem: (serviceId: string) => void;
  updateQuantity: (serviceId: string, quantity: number) => void;
  clearCart: () => void;
  setAddress: (address: SelectedAddress) => void;
  setSchedule: (schedule: ScheduleInfo) => void;
  setPaymentMethod: (method: "cash" | "upi" | "card" | "wallet") => void;
  totalItems: number;
  subtotal: number;
  discount: number;
  total: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<SelectedAddress | null>(null);
  const [schedule, setScheduleState] = useState<ScheduleInfo | null>(null);
  const [paymentMethod, setPaymentMethodState] = useState<"cash" | "upi" | "card" | "wallet">("cash");

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("zaplyt-cart");
    if (savedCart) {
      try {
        const parsed = JSON.parse(savedCart);
        setItems(parsed.items || []);
        setSelectedAddress(parsed.selectedAddress || null);
        if (parsed.schedule) {
          setScheduleState({
            ...parsed.schedule,
            date: new Date(parsed.schedule.date),
          });
        }
        setPaymentMethodState(parsed.paymentMethod || "cash");
      } catch {
        console.error("Failed to parse cart");
      }
    }
  }, []);

  // Save cart to localStorage on change
  useEffect(() => {
    localStorage.setItem(
      "zaplyt-cart",
      JSON.stringify({ items, selectedAddress, schedule, paymentMethod })
    );
  }, [items, selectedAddress, schedule, paymentMethod]);

  const addItem = (item: CartItem) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.serviceId === item.serviceId);
      if (existing) {
        return prev.map((i) =>
          i.serviceId === item.serviceId ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeItem = (serviceId: string) => {
    setItems((prev) => prev.filter((i) => i.serviceId !== serviceId));
  };

  const updateQuantity = (serviceId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(serviceId);
      return;
    }
    setItems((prev) =>
      prev.map((i) => (i.serviceId === serviceId ? { ...i, quantity } : i))
    );
  };

  const clearCart = () => {
    setItems([]);
    setSelectedAddress(null);
    setScheduleState(null);
    setPaymentMethodState("cash");
    localStorage.removeItem("zaplyt-cart");
  };

  const setAddress = (address: SelectedAddress) => {
    setSelectedAddress(address);
  };

  const setSchedule = (scheduleInfo: ScheduleInfo) => {
    setScheduleState(scheduleInfo);
  };

  const setPaymentMethod = (method: "cash" | "upi" | "card" | "wallet") => {
    setPaymentMethodState(method);
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = 0; // Can implement discount logic
  const total = subtotal - discount;

  return (
    <CartContext.Provider
      value={{
        items,
        selectedAddress,
        schedule,
        paymentMethod,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        setAddress,
        setSchedule,
        setPaymentMethod,
        totalItems,
        subtotal,
        discount,
        total,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
