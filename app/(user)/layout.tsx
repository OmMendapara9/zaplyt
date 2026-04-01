"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Home, Calendar, User } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/home", icon: Home, label: "Home" },
  { href: "/bookings", icon: Calendar, label: "Bookings" },
  { href: "/profile", icon: User, label: "Profile" },
];

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Hide bottom nav on certain pages
  const hideBottomNav = [
    "/booking",
    "/services",
  ].some((path) => pathname.startsWith(path));

  return (
    <div className="min-h-screen bg-background pb-20">
      {children}

      {/* Bottom Navigation */}
      {!hideBottomNav && (
        <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border z-50">
          <div className="max-w-md mx-auto flex justify-around py-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex flex-col items-center gap-1 px-6 py-2 transition-colors",
                    isActive ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  <item.icon className="w-6 h-6" />
                  <span className="text-xs font-medium">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>
      )}
    </div>
  );
}
