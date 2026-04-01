"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  User,
  Star,
  Wallet,
  Settings,
  HelpCircle,
  LogOut,
  ChevronRight,
  Shield,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function ProviderProfilePage() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await logout();
    router.push("/login");
  };

  const menuItems = [
    {
      icon: User,
      label: "Edit Profile",
      href: "/provider/profile/edit",
      description: "Update your personal information",
    },
    {
      icon: Wallet,
      label: "Earnings",
      href: "/provider/earnings",
      description: "View your earnings and payouts",
    },
    {
      icon: Settings,
      label: "Settings",
      href: "/provider/settings",
      description: "Manage your preferences",
    },
    {
      icon: HelpCircle,
      label: "Help & Support",
      href: "/provider/support",
      description: "Get help with your account",
    },
    {
      icon: FileText,
      label: "Terms of Service",
      href: "/provider/terms",
      description: "Read our terms and conditions",
    },
    {
      icon: Shield,
      label: "Privacy Policy",
      href: "/provider/privacy",
      description: "Learn how we protect your data",
    },
  ];

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="bg-primary px-4 pt-12 pb-8">
        <h1 className="text-xl font-semibold text-primary-foreground mb-6">
          Profile
        </h1>

        {/* Provider Info Card */}
        <div className="bg-card rounded-xl p-4 flex items-center gap-4 shadow-sm">
          <Avatar className="h-16 w-16">
            <AvatarImage src={user?.avatar} />
            <AvatarFallback className="bg-primary/10 text-primary text-lg">
              {user?.name?.charAt(0) || "P"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h2 className="font-semibold text-foreground truncate">
              {user?.name || "Service Provider"}
            </h2>
            <p className="text-sm text-muted-foreground">
              {user?.phone || "+91 XXXXXXXXXX"}
            </p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                Active
              </span>
              <span className="text-xs text-muted-foreground">
                Service Provider
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-full">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium text-yellow-700">4.8</span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="px-4 -mt-2">
        <div className="bg-card rounded-xl p-4 shadow-sm grid grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-primary">156</p>
            <p className="text-xs text-muted-foreground">Total Jobs</p>
          </div>
          <div className="text-center border-x border-border">
            <p className="text-2xl font-bold text-green-600">150</p>
            <p className="text-xs text-muted-foreground">Completed</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-yellow-500">98%</p>
            <p className="text-xs text-muted-foreground">Rating</p>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="px-4 mt-4">
        <div className="bg-card rounded-xl shadow-sm overflow-hidden">
          {menuItems.map((item, index) => (
            <button
              key={item.label}
              onClick={() => router.push(item.href)}
              className={`w-full flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors ${
                index !== menuItems.length - 1 ? "border-b border-border" : ""
              }`}
            >
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <item.icon className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-medium text-foreground">{item.label}</p>
                <p className="text-xs text-muted-foreground">
                  {item.description}
                </p>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </button>
          ))}
        </div>
      </div>

      {/* Logout Button */}
      <div className="px-4 mt-6">
        <Button
          variant="outline"
          className="w-full h-12 text-destructive border-destructive/30 hover:bg-destructive/10"
          onClick={handleLogout}
          disabled={isLoggingOut}
        >
          <LogOut className="h-5 w-5 mr-2" />
          {isLoggingOut ? "Logging out..." : "Logout"}
        </Button>
      </div>

      {/* App Version */}
      <p className="text-center text-xs text-muted-foreground mt-6">
        Zaplyt Provider v1.0.0
      </p>
    </div>
  );
}
