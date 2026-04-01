"use client";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";

const categories = [
  { id: "salon-women", title: "Salon for Women" },
  { id: "salon-men", title: "Salon for Men" },
  { id: "ac-service", title: "AC Service" },
  { id: "cleaning", title: "Cleaning" },
];

export default function ServicesRootPage() {
  return (
    <div className="min-h-screen bg-background p-4 pb-24">
      <header className="mb-4 flex items-center gap-3">
        <Link href="/home" className="text-primary text-sm font-semibold">
          <ChevronLeft className="inline w-4 h-4" /> Back
        </Link>
        <h1 className="text-xl font-bold">All Services</h1>
      </header>

      <div className="grid grid-cols-1 gap-3">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/services/${cat.id}`}
            className="block rounded-lg border border-border p-4 bg-card hover:border-primary hover:bg-primary/5"
          >
            <h2 className="text-lg font-semibold">{cat.title}</h2>
            <p className="text-sm text-muted-foreground">View services for {cat.title}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
