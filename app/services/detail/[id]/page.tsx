import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { formatPrice } from "@/lib/utils";
import { Star } from "lucide-react";

const fallbackServices = [
  { id: "1", name: "Classic Facial", price: 799, rating: 4.8, reviews: 2340, duration: "1 hr", image: "/images/facial.jpg", description: "Classic facial for glowing skin" },
  { id: "2", name: "Full Body Waxing", price: 1499, rating: 4.7, reviews: 1890, duration: "1.5 hrs", image: "/images/waxing.jpg", description: "Smooth waxing service" },
  { id: "3", name: "AC Deep Clean", price: 499, rating: 4.9, reviews: 3200, duration: "45 mins", image: "/images/ac-service.jpg", description: "Professional AC deep clean" },
  { id: "4", name: "Bathroom Cleaning", price: 399, rating: 4.6, reviews: 2100, duration: "1 hr", image: "/images/cleaning.jpg", description: "Bathroom sanitation and deep clean" },
];

async function getService(id: string) {
  try {
    const res = await fetch(`${process.env.NEXTAUTH_URL || "http://localhost:3000"}/api/services`, { cache: "no-store" });
    if (!res.ok) return null;
    const data = await res.json();
    if (!data?.services) return null;

    const service = data.services.find((item: any) => item._id === id || item.id?.toString() === id);
    if (service) return service;
  } catch (error) {
    console.error("Service detail fetch error:", error);
  }

  // fallback for static ids from homepage
  return fallbackServices.find((item) => item.id === id) || null;
}

export default async function ServiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const service = await getService(id);
  if (!service) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="relative h-64 bg-muted">
        <Image src={service.image} alt={service.name} fill className="object-cover" />
      </div>

      <div className="p-4">
        <Link href="/home" className="text-sm text-primary mb-2 inline-block">
          &larr; Back to Home
        </Link>

        <h1 className="text-2xl font-bold text-foreground mb-2">{service.name}</h1>
        <div className="flex items-center gap-2 mb-4 text-sm text-muted-foreground">
          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          <span>{service.rating.toFixed?.(1) || service.rating}</span>
          <span>({service.reviews} reviews)</span>
          <span>• {service.duration}</span>
        </div>
        <p className="text-base text-muted-foreground mb-4">{service.description || "Service details not available."}</p>
        <p className="text-xl font-bold text-foreground mb-4">{formatPrice(service.price)}</p>

        <div className="space-y-3">
          <Link href="/booking/summary" className="block w-full text-center bg-primary text-primary-foreground py-3 rounded-lg">
            Book Now
          </Link>
          <Link href="/services" className="block w-full text-center border border-border rounded-lg py-3">
            Browse more services
          </Link>
        </div>
      </div>
    </div>
  );
}
