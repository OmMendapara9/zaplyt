"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function UserProfilePage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background p-4 pb-24">
      <h1 className="text-2xl font-bold mb-2">Profile</h1>
      <p className="text-sm text-muted-foreground mb-4">This is your user profile.</p>

      <div className="bg-card border border-border rounded-xl p-4">
        <p className="font-medium">Name: {user?.name ?? "Guest"}</p>
        <p>Email: {user?.email ?? "Not set"}</p>
        <p>Phone: {user?.phone ?? "Not set"}</p>
      </div>

      <div className="mt-4">
        <Link href="/home" className="text-primary text-sm font-semibold">
          Back to Home
        </Link>
      </div>
    </div>
  );
}
