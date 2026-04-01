"use client";

import { useState } from "react";
import { MapPin, Search, ChevronRight, Star, ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/utils";

const categories = [
  { id: "salon-women", name: "Salon for Women", icon: "💇‍♀️", color: "bg-pink-100" },
  { id: "salon-men", name: "Salon for Men", icon: "💇‍♂️", color: "bg-blue-100" },
  { id: "ac-service", name: "AC Service", icon: "❄️", color: "bg-cyan-100" },
  { id: "cleaning", name: "Cleaning", icon: "🧹", color: "bg-green-100" },
  { id: "electrician", name: "Electrician", icon: "⚡", color: "bg-yellow-100" },
  { id: "plumber", name: "Plumber", icon: "🔧", color: "bg-indigo-100" },
  { id: "appliance", name: "Appliance Repair", icon: "🔌", color: "bg-orange-100" },
  { id: "painter", name: "Painter", icon: "🎨", color: "bg-purple-100" },
];

const popularServices = [
  {
    id: "1",
    name: "Classic Facial",
    category: "Salon for Women",
    price: 799,
    rating: 4.8,
    reviews: 2340,
    duration: "1 hr",
    image: "/images/facial.jpg",
  },
  {
    id: "2",
    name: "Full Body Waxing",
    category: "Salon for Women",
    price: 1499,
    rating: 4.7,
    reviews: 1890,
    duration: "1.5 hrs",
    image: "/images/waxing.jpg",
  },
  {
    id: "3",
    name: "AC Deep Clean",
    category: "AC Service",
    price: 499,
    rating: 4.9,
    reviews: 3200,
    duration: "45 mins",
    image: "/images/ac-service.jpg",
  },
  {
    id: "4",
    name: "Bathroom Cleaning",
    category: "Cleaning",
    price: 399,
    rating: 4.6,
    reviews: 2100,
    duration: "1 hr",
    image: "/images/cleaning.jpg",
  },
];

export default function HomePage() {
  const { user } = useAuth();
  const { totalItems } = useCart();
  const [searchQuery, setSearchQuery] = useState("");

  const defaultAddress = user?.addresses?.find((a) => a.isDefault);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-primary-foreground px-4 pt-4 pb-6">
        {/* Location */}
        <div className="flex items-center justify-between mb-4">
          <button className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            <div className="text-left">
              <p className="text-xs opacity-80">Current Location</p>
              <p className="font-medium text-sm truncate max-w-[200px]">
                {defaultAddress?.address || "Select Address"}
              </p>
            </div>
            <ChevronRight className="w-4 h-4 opacity-60" />
          </button>

          {/* Cart */}
          <Link
            href="/booking/summary"
            className="relative p-2 bg-white/10 rounded-full"
          >
            <ShoppingCart className="w-5 h-5" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-success text-success-foreground text-xs font-bold rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search for services..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white rounded-xl text-foreground placeholder:text-muted-foreground outline-none"
          />
        </div>
      </header>

      {/* Banner */}
      <div className="px-4 py-4">
        <div className="bg-gradient-to-r from-primary/10 to-success/10 rounded-2xl p-4 flex items-center gap-4">
          <div className="flex-1">
            <p className="text-xs text-primary font-medium mb-1">Limited Offer</p>
            <h3 className="font-bold text-foreground mb-1">Get 20% OFF</h3>
            <p className="text-xs text-muted-foreground">On your first booking</p>
          </div>
          <div className="w-20 h-20 bg-primary/20 rounded-xl flex items-center justify-center text-4xl">
            🎉
          </div>
        </div>
      </div>

      {/* Categories */}
      <section className="px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-foreground">Categories</h2>
          <Link href="/categories" className="text-sm text-primary font-medium">
            See All
          </Link>
        </div>

        <div className="grid grid-cols-4 gap-4">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/services/${category.id}`}
              className="flex flex-col items-center gap-2"
            >
              <div
                className={`w-14 h-14 ${category.color} rounded-2xl flex items-center justify-center text-2xl`}
              >
                {category.icon}
              </div>
              <span className="text-xs text-center text-foreground font-medium leading-tight">
                {category.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Popular Services */}
      <section className="px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-foreground">Popular Services</h2>
          <Link href="/services" className="text-sm text-primary font-medium">
            See All
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {popularServices.map((service) => (
            <Link
              key={service.id}
              href={`/services/detail/${service.id}`}
              className="bg-card rounded-xl overflow-hidden border border-border"
            >
              <div className="relative h-28 bg-muted">
                <Image
                  src={service.image}
                  alt={service.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-3">
                <h3 className="font-semibold text-sm text-foreground mb-1 truncate">
                  {service.name}
                </h3>
                <p className="text-xs text-muted-foreground mb-2">
                  {service.duration}
                </p>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-foreground">
                    {formatPrice(service.price)}
                  </span>
                  <div className="flex items-center gap-1 text-xs">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{service.rating}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="px-4 py-4 mb-4">
        <h2 className="text-lg font-bold text-foreground mb-4">Why Choose Us</h2>
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: "✓", title: "Verified", desc: "Background checked" },
            { icon: "⭐", title: "Top Rated", desc: "4.5+ rating" },
            { icon: "🛡️", title: "Safe", desc: "100% secure" },
          ].map((item, i) => (
            <div key={i} className="bg-muted rounded-xl p-3 text-center">
              <div className="text-2xl mb-2">{item.icon}</div>
              <h4 className="font-semibold text-sm text-foreground">{item.title}</h4>
              <p className="text-xs text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
