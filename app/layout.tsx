import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { Toaster } from "@/components/ui/toaster";
import Logo from "@/components/Logo";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Zaplyt - Home Services at Your Doorstep",
  description: "Book professional home services including salon, cleaning, repairs, and more. Quality service providers at your fingertips.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#1E3A8A",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans`}>
        <AuthProvider>
          <CartProvider>
            <div className="mx-auto max-w-md min-h-screen bg-background">
              <header className="sticky top-0 z-50 border-b border-border bg-background/90 py-3 backdrop-blur">
                <div className="px-4">
                  <Logo />
                </div>
              </header>
              <main className="px-4 pb-8">{children}</main>
            </div>
            <Toaster />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
