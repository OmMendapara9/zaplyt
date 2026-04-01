"use client";

import { use, useState, useEffect } from "react";
import { ChevronLeft, Search, ShoppingCart, Star, Minus, Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useCart, CartItem } from "@/context/CartContext";
import { formatPrice } from "@/lib/utils";

// Mock data for services
const servicesData: Record<string, { name: string; subcategories: { id: string; name: string; services: ServiceType[] }[] }> = {
  "salon-women": {
    name: "Salon for Women",
    subcategories: [
      {
        id: "facial",
        name: "Facial for Glow",
        services: [
          {
            id: "s1",
            name: "Classic Facial",
            price: 799,
            originalPrice: 999,
            duration: "1 hr",
            rating: 4.8,
            reviews: 2340,
            image: "/images/facial.jpg",
            includes: ["Deep cleansing", "Exfoliation", "Face massage", "Mask application"],
          },
          {
            id: "s2",
            name: "Gold Facial",
            price: 1299,
            originalPrice: 1599,
            duration: "1 hr 15 mins",
            rating: 4.9,
            reviews: 1890,
            image: "/images/gold-facial.jpg",
            includes: ["Gold serum", "Deep cleansing", "Face massage", "Gold mask"],
          },
          {
            id: "s3",
            name: "Diamond Facial",
            price: 1499,
            originalPrice: 1899,
            duration: "1 hr 30 mins",
            rating: 4.9,
            reviews: 1560,
            image: "/images/diamond-facial.jpg",
            includes: ["Diamond scrub", "Deep cleansing", "Face massage", "Diamond mask", "Serum"],
          },
        ],
      },
      {
        id: "waxing",
        name: "Waxing",
        services: [
          {
            id: "s4",
            name: "Full Arms Waxing",
            price: 299,
            duration: "30 mins",
            rating: 4.7,
            reviews: 3200,
            image: "/images/waxing.jpg",
            includes: ["Full arms wax", "Aftercare lotion"],
          },
          {
            id: "s5",
            name: "Full Legs Waxing",
            price: 399,
            duration: "45 mins",
            rating: 4.6,
            reviews: 2800,
            image: "/images/waxing.jpg",
            includes: ["Full legs wax", "Aftercare lotion"],
          },
          {
            id: "s6",
            name: "Full Body Waxing",
            price: 1499,
            originalPrice: 1799,
            duration: "1.5 hrs",
            rating: 4.8,
            reviews: 1900,
            image: "/images/waxing.jpg",
            includes: ["Full body wax", "Underarms", "Aftercare lotion"],
          },
        ],
      },
      {
        id: "manicure",
        name: "Manicure & Pedicure",
        services: [
          {
            id: "s7",
            name: "Classic Manicure",
            price: 399,
            duration: "30 mins",
            rating: 4.6,
            reviews: 1200,
            image: "/images/manicure.jpg",
            includes: ["Nail shaping", "Cuticle care", "Hand massage", "Polish"],
          },
          {
            id: "s8",
            name: "Spa Pedicure",
            price: 599,
            duration: "45 mins",
            rating: 4.7,
            reviews: 980,
            image: "/images/pedicure.jpg",
            includes: ["Foot soak", "Scrub", "Massage", "Polish"],
          },
        ],
      },
    ],
  },
  "ac-service": {
    name: "AC Service",
    subcategories: [
      {
        id: "ac-repair",
        name: "AC Repair",
        services: [
          {
            id: "ac1",
            name: "AC Gas Refill",
            price: 1499,
            duration: "1 hr",
            rating: 4.8,
            reviews: 4500,
            image: "/images/ac-service.jpg",
            includes: ["Gas refill", "Pressure check", "Leak detection"],
          },
          {
            id: "ac2",
            name: "AC Not Cooling",
            price: 299,
            duration: "30 mins",
            rating: 4.7,
            reviews: 3800,
            image: "/images/ac-service.jpg",
            includes: ["Diagnosis", "Filter check", "Basic service"],
          },
        ],
      },
      {
        id: "ac-service",
        name: "AC Service & Clean",
        services: [
          {
            id: "ac3",
            name: "AC Deep Clean",
            price: 499,
            originalPrice: 699,
            duration: "45 mins",
            rating: 4.9,
            reviews: 5200,
            image: "/images/ac-service.jpg",
            includes: ["Jet cleaning", "Filter cleaning", "Coil cleaning", "Final check"],
          },
          {
            id: "ac4",
            name: "Complete AC Service",
            price: 799,
            duration: "1 hr",
            rating: 4.8,
            reviews: 2900,
            image: "/images/ac-service.jpg",
            includes: ["Deep cleaning", "Gas top-up", "Filter replacement"],
          },
        ],
      },
    ],
  },
  "cleaning": {
    name: "Cleaning",
    subcategories: [
      {
        id: "home-cleaning",
        name: "Home Cleaning",
        services: [
          {
            id: "c1",
            name: "Full Home Cleaning",
            price: 1999,
            duration: "3-4 hrs",
            rating: 4.7,
            reviews: 2100,
            image: "/images/cleaning.jpg",
            includes: ["All rooms", "Kitchen", "Bathrooms", "Dusting"],
          },
          {
            id: "c2",
            name: "Bathroom Cleaning",
            price: 399,
            duration: "1 hr",
            rating: 4.6,
            reviews: 1800,
            image: "/images/cleaning.jpg",
            includes: ["Deep cleaning", "Tiles", "Fixtures", "Sanitization"],
          },
        ],
      },
    ],
  },
};

interface ServiceType {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  duration: string;
  rating: number;
  reviews: number;
  image: string;
  includes: string[];
}

export default function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = use(params);
  const router = useRouter();
  const { items, addItem, removeItem, updateQuantity, totalItems } = useCart();
  const [selectedService, setSelectedService] = useState<ServiceType | null>(null);
  const [activeSubcategory, setActiveSubcategory] = useState<string | null>(null);

  const categoryData = servicesData[category];

  if (!categoryData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Category not found</p>
      </div>
    );
  }

  // Set default active subcategory
  if (!activeSubcategory && categoryData.subcategories.length > 0) {
    setActiveSubcategory(categoryData.subcategories[0].id);
  }

  const activeSubcategoryData = categoryData.subcategories.find(
    (s) => s.id === activeSubcategory
  );

  const getItemQuantity = (serviceId: string) => {
    const item = items.find((i) => i.serviceId === serviceId);
    return item?.quantity || 0;
  };

  const handleAddToCart = (service: ServiceType) => {
    const cartItem: CartItem = {
      serviceId: service.id,
      name: service.name,
      price: service.price,
      quantity: 1,
      duration: service.duration,
      image: service.image,
      category: categoryData.name,
    };
    addItem(cartItem);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 bg-background z-40 border-b border-border">
        <div className="flex items-center gap-4 p-4">
          <button
            onClick={() => router.back()}
            className="w-10 h-10 bg-muted rounded-full flex items-center justify-center"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-bold flex-1">{categoryData.name}</h1>
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
              placeholder={`Search in ${categoryData.name}`}
              className="w-full pl-10 pr-4 py-2 bg-muted rounded-lg text-sm outline-none"
            />
          </div>
        </div>

        {/* Subcategory tabs */}
        <div className="flex overflow-x-auto gap-2 px-4 pb-3 scrollbar-hide">
          {categoryData.subcategories.map((sub) => (
            <button
              key={sub.id}
              onClick={() => setActiveSubcategory(sub.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                activeSubcategory === sub.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-foreground"
              }`}
            >
              {sub.name}
            </button>
          ))}
        </div>
      </header>

      {/* Services list */}
      <div className="p-4 space-y-4 pb-24">
        {activeSubcategoryData?.services.map((service) => {
          const quantity = getItemQuantity(service.id);

          return (
            <div
              key={service.id}
              className="bg-card rounded-xl border border-border overflow-hidden"
            >
              <div className="flex gap-4 p-4">
                {/* Image */}
                <div
                  className="relative w-24 h-24 rounded-lg overflow-hidden bg-muted flex-shrink-0 cursor-pointer"
                  onClick={() => setSelectedService(service)}
                >
                  <Image
                    src={service.image}
                    alt={service.name}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h3
                    className="font-semibold text-foreground mb-1 cursor-pointer"
                    onClick={() => setSelectedService(service)}
                  >
                    {service.name}
                  </h3>

                  <div className="flex items-center gap-2 text-sm mb-2">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{service.rating}</span>
                    <span className="text-muted-foreground">
                      ({service.reviews.toLocaleString()})
                    </span>
                  </div>

                  <p className="text-xs text-muted-foreground mb-2">
                    {service.duration}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-foreground">
                        {formatPrice(service.price)}
                      </span>
                      {service.originalPrice && (
                        <span className="text-sm text-muted-foreground line-through">
                          {formatPrice(service.originalPrice)}
                        </span>
                      )}
                    </div>

                    {/* Add/Remove buttons */}
                    {quantity > 0 ? (
                      <div className="flex items-center gap-3 bg-primary rounded-lg px-2">
                        <button
                          onClick={() => updateQuantity(service.id, quantity - 1)}
                          className="p-1 text-primary-foreground"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="font-bold text-primary-foreground w-4 text-center">
                          {quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(service.id, quantity + 1)}
                          className="p-1 text-primary-foreground"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleAddToCart(service)}
                        className="px-4 py-1.5 border-2 border-primary text-primary rounded-lg text-sm font-semibold"
                      >
                        Add
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Includes preview */}
              <div className="px-4 pb-4">
                <p className="text-xs text-muted-foreground">
                  Includes: {service.includes.slice(0, 2).join(", ")}
                  {service.includes.length > 2 && "..."}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Cart button */}
      {totalItems > 0 && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t border-border">
          <Link
            href="/booking/summary"
            className="w-full max-w-md mx-auto bg-primary text-primary-foreground py-4 rounded-xl font-semibold flex items-center justify-center gap-2"
          >
            <ShoppingCart className="w-5 h-5" />
            View Cart ({totalItems} items)
          </Link>
        </div>
      )}

      {/* Service detail bottom sheet */}
      <AnimatePresence>
        {selectedService && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50"
              onClick={() => setSelectedService(null)}
            />

            {/* Bottom sheet */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 bg-background rounded-t-3xl z-50 max-h-[85vh] overflow-auto"
            >
              {/* Handle */}
              <div className="flex justify-center pt-3 pb-2">
                <div className="w-10 h-1 bg-muted-foreground/30 rounded-full" />
              </div>

              {/* Image */}
              <div className="relative h-48 bg-muted">
                <Image
                  src={selectedService.image}
                  alt={selectedService.name}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Content */}
              <div className="p-4">
                <h2 className="text-xl font-bold text-foreground mb-2">
                  {selectedService.name}
                </h2>

                <div className="flex items-center gap-2 mb-4">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{selectedService.rating}</span>
                  <span className="text-muted-foreground">
                    ({selectedService.reviews.toLocaleString()} reviews)
                  </span>
                  <span className="text-muted-foreground">•</span>
                  <span className="text-muted-foreground">{selectedService.duration}</span>
                </div>

                <div className="flex items-center gap-2 mb-6">
                  <span className="text-2xl font-bold text-foreground">
                    {formatPrice(selectedService.price)}
                  </span>
                  {selectedService.originalPrice && (
                    <>
                      <span className="text-lg text-muted-foreground line-through">
                        {formatPrice(selectedService.originalPrice)}
                      </span>
                      <span className="px-2 py-0.5 bg-success/10 text-success text-sm font-medium rounded">
                        {Math.round(
                          ((selectedService.originalPrice - selectedService.price) /
                            selectedService.originalPrice) *
                            100
                        )}
                        % OFF
                      </span>
                    </>
                  )}
                </div>

                <h3 className="font-semibold text-foreground mb-3">What&apos;s Included</h3>
                <ul className="space-y-2 mb-6">
                  {selectedService.includes.map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-muted-foreground">
                      <span className="w-1.5 h-1.5 bg-primary rounded-full" />
                      {item}
                    </li>
                  ))}
                </ul>

                {/* Add to cart button */}
                {getItemQuantity(selectedService.id) > 0 ? (
                  <div className="flex items-center justify-center gap-4 bg-primary rounded-xl p-3">
                    <button
                      onClick={() =>
                        updateQuantity(
                          selectedService.id,
                          getItemQuantity(selectedService.id) - 1
                        )
                      }
                      className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-primary-foreground"
                    >
                      <Minus className="w-5 h-5" />
                    </button>
                    <span className="text-xl font-bold text-primary-foreground w-8 text-center">
                      {getItemQuantity(selectedService.id)}
                    </span>
                    <button
                      onClick={() =>
                        updateQuantity(
                          selectedService.id,
                          getItemQuantity(selectedService.id) + 1
                        )
                      }
                      className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-primary-foreground"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      handleAddToCart(selectedService);
                      setSelectedService(null);
                    }}
                    className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-semibold"
                  >
                    Add to Cart - {formatPrice(selectedService.price)}
                  </button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
