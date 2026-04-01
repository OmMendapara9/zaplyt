"use client";

import { use, useState, useEffect } from "react";
import { ChevronLeft, Search, ShoppingCart, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useCart, CartItem } from "@/context/CartContext";
import { formatPrice } from "@/lib/utils";

interface ServiceType {
  _id: string;
  name: string;
  price: number;
  originalPrice?: number;
  duration: string;
  rating: number;
  reviewCount: number;
  image: string;
  includes?: string[];
  category: string;
  subcategory?: string;
}

const categoryNameMap: Record<string, string> = {
  "salon-women": "Salon for Women",
  "salon-men": "Salon for Men",
};

export default function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = use(params);
  const router = useRouter();
  const { items, addItem, removeItem, updateQuantity, totalItems } = useCart();
  const [services, setServices] = useState<ServiceType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [selectedService, setSelectedService] = useState<ServiceType | null>(null);

  const categoryName = categoryNameMap[category] || category;

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/services?category=${encodeURIComponent(categoryName)}`);
        if (!response.ok) {
          throw new Error("Failed to fetch services");
        }
        const data = await response.json();
        setServices(data.services || []);
      } catch (err) {
        console.error("Error fetching services:", err);
        setError("Failed to load services");
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [categoryName]);

  const getItemQuantity = (serviceId: string) => {
    const item = items.find((i) => i.serviceId === serviceId);
    return item?.quantity || 0;
  };

  const handleAddToCart = (service: ServiceType) => {
    const cartItem: CartItem = {
      serviceId: service._id,
      name: service.name,
      price: service.price,
      quantity: 1,
      duration: service.duration,
      image: service.image,
      category: categoryName,
    };
    addItem(cartItem);
  };

  const handleRemoveFromCart = (serviceId: string) => {
    removeItem(serviceId);
  };

  const handleQuantityChange = (serviceId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(serviceId);
    } else {
      updateQuantity(serviceId, newQuantity);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
          <p className="text-muted-foreground">Loading services...</p>
        </div>
      </div>
    );
  }

  if (error|| services.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <header className="sticky top-0 bg-background z-40 border-b border-border">
          <div className="flex items-center gap-4 p-4">
            <button
              onClick={() => router.back()}
              className="w-10 h-10 bg-muted rounded-full flex items-center justify-center"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h1 className="text-lg font-bold flex-1">{categoryName}</h1>
          </div>
        </header>
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <p className="text-muted-foreground mb-4">
            {error || "No services available in this category"}
          </p>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-32">
      {/* Header */}
      <header className="sticky top-0 bg-background z-40 border-b border-border">
        <div className="flex items-center gap-4 p-4">
          <button
            onClick={() => router.back()}
            className="w-10 h-10 bg-muted rounded-full flex items-center justify-center"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-bold flex-1">{categoryName}</h1>
          <Link href="/booking/summary" className="relative p-2">
            <ShoppingCart className="w-6 h-6" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-xs font-bold rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>
        </div>

        {/* Search */}
        <div className="px-4 pb-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search services"
              className="w-full pl-10 pr-4 py-2 bg-muted rounded-lg text-sm outline-none"
            />
          </div>
        </div>
      </header>

      {/* Services Grid */}
      <div className="p-4">
        <div className="grid gap-4">
          {services.map((service) => {
            const quantity = getItemQuantity(service._id);
            const discount = service.originalPrice
              ? Math.round(((service.originalPrice - service.price) / service.originalPrice) * 100)
              : 0;

            return (
              <motion.div
                key={service._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-4 p-4 bg-card rounded-lg border border-border hover:border-primary/50 transition-colors"
              >
                {/* Image */}
                <div className="flex-shrink-0">
                  <Image
                    src={service.image}
                    alt={service.name}
                    width={100}
                    height={100}
                    className="rounded-lg object-cover w-24 h-24"
                  />
                </div>

                {/* Content */}
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground mb-1">{service.name}</h3>
                  
                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center gap-1">
                      <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{service.rating.toFixed(1)}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">({service.reviewCount || 0} reviews)</span>
                  </div>

                  {/* Duration & Price */}
                  <div className="flex items-center gap-2 justify-between">
                    <span className="text-sm text-muted-foreground">{service.duration}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-foreground">{formatPrice(service.price)}</span>
                      {service.originalPrice && discount > 0 && (
                        <>
                          <span className="text-sm text-muted-foreground line-through">
                            {formatPrice(service.originalPrice)}
                          </span>
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                            {discount}% off
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Add/Remove Button */}
                <div className="flex items-center gap-2">
                  {quantity === 0 ? (
                    <button
                      onClick={() => handleAddToCart(service)}
                      className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-semibold text-sm"
                    >
                      Add
                    </button>
                  ) : (
                    <div className="flex items-center gap-2 bg-muted rounded-lg p-1">
                      <button
                        onClick={() => handleQuantityChange(service._id, quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:bg-primary/10 rounded"
                      >
                        −
                      </button>
                      <span className="w-6 text-center font-semibold">{quantity}</span>
                      <button
                        onClick={() => handleQuantityChange(service._id, quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:bg-primary/10 rounded"
                      >
                        +
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
