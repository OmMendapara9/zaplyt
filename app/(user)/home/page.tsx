"use client";

import { useState, useEffect } from "react";
import { MapPin, Search, ChevronRight, Star, ShoppingCart, Shield, Clock, Award, Users, ArrowRight, CheckCircle, Sparkles, Zap, Heart, TrendingUp } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const categories = [
  { id: "salon-women", name: "Salon for Women", icon: "💇‍♀️", color: "bg-pink-50 border-pink-200 hover:bg-pink-100", services: "120+ services", gradient: "from-pink-400 to-rose-500" },
  { id: "salon-men", name: "Salon for Men", icon: "💇‍♂️", color: "bg-blue-50 border-blue-200 hover:bg-blue-100", services: "80+ services", gradient: "from-blue-400 to-cyan-500" },
  { id: "ac-service", name: "AC Service", icon: "❄️", color: "bg-cyan-50 border-cyan-200 hover:bg-cyan-100", services: "50+ services", gradient: "from-cyan-400 to-blue-500" },
  { id: "cleaning", name: "Cleaning", icon: "🧹", color: "bg-green-50 border-green-200 hover:bg-green-100", services: "90+ services", gradient: "from-green-400 to-emerald-500" },
  { id: "electrician", name: "Electrician", icon: "⚡", color: "bg-yellow-50 border-yellow-200 hover:bg-yellow-100", services: "70+ services", gradient: "from-yellow-400 to-orange-500" },
  { id: "plumber", name: "Plumber", icon: "🔧", color: "bg-indigo-50 border-indigo-200 hover:bg-indigo-100", services: "60+ services", gradient: "from-indigo-400 to-purple-500" },
  { id: "appliance", name: "Appliance Repair", icon: "🔌", color: "bg-orange-50 border-orange-200 hover:bg-orange-100", services: "85+ services", gradient: "from-orange-400 to-red-500" },
  { id: "painter", name: "Painter", icon: "🎨", color: "bg-purple-50 border-purple-200 hover:bg-purple-100", services: "40+ services", gradient: "from-purple-400 to-pink-500" },
];

const featuredWorkers = [
  {
    id: "1",
    name: "Priya Sharma",
    specialty: "Beauty Expert",
    rating: 4.9,
    reviews: 234,
    experience: "5 years",
    image: "/images/worker1.jpg",
    verified: true,
    badge: "Top Rated",
  },
  {
    id: "2",
    name: "Rajesh Kumar",
    specialty: "AC Technician",
    rating: 4.8,
    reviews: 189,
    experience: "7 years",
    image: "/images/worker2.jpg",
    verified: true,
    badge: "Expert",
  },
  {
    id: "3",
    name: "Anita Patel",
    specialty: "Cleaning Pro",
    rating: 4.9,
    reviews: 312,
    experience: "4 years",
    image: "/images/worker3.jpg",
    verified: true,
    badge: "Verified",
  },
];

const testimonials = [
  {
    id: "1",
    name: "Sarah Johnson",
    service: "Home Cleaning",
    rating: 5,
    comment: "Amazing service! The cleaner was professional and thorough. Will definitely book again.",
    image: "/images/testimonial1.jpg",
    location: "Mumbai",
  },
  {
    id: "2",
    name: "Mike Chen",
    service: "AC Repair",
    rating: 5,
    comment: "Fixed my AC in no time. Very knowledgeable and friendly. Highly recommended!",
    image: "/images/testimonial2.jpg",
    location: "Delhi",
  },
  {
    id: "3",
    name: "Emma Wilson",
    service: "Beauty Service",
    rating: 5,
    comment: "Best salon experience ever! The stylist was amazing and the results were perfect.",
    image: "/images/testimonial3.jpg",
    location: "Bangalore",
  },
];

const stats = [
  { value: "50K+", label: "Happy Customers", icon: Users, color: "text-blue-500" },
  { value: "10K+", label: "Verified Pros", icon: Shield, color: "text-green-500" },
  { value: "100+", label: "Services", icon: Sparkles, color: "text-purple-500" },
  { value: "4.9", label: "Avg Rating", icon: Star, color: "text-yellow-500" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 12,
    },
  },
};

const FloatingElement = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => (
  <motion.div
    animate={{
      y: [0, -10, 0],
      rotate: [0, 2, 0],
    }}
    transition={{
      duration: 4,
      repeat: Infinity,
      delay,
      ease: "easeInOut",
    }}
  >
    {children}
  </motion.div>
);

export default function HomePage() {
  const { user } = useAuth();
  const { totalItems } = useCart();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -50]);

  const defaultAddress = user?.addresses?.find((a) => a.isDefault);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-20 right-10 w-32 h-32 bg-primary/10 rounded-full blur-xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.1, 0.15, 0.1],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
          className="absolute bottom-40 left-10 w-24 h-24 bg-success/10 rounded-full blur-xl"
        />
      </div>

      {/* Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className="bg-card/80 backdrop-blur-lg border-b border-border px-4 pt-4 pb-6 sticky top-0 z-40"
      >
        {/* Location */}
        <div className="flex items-center justify-between mb-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 group"
          >
            <motion.div
              animate={{ rotate: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: 1 }}
            >
              <MapPin className="w-5 h-5 text-primary" />
            </motion.div>
            <div className="text-left">
              <p className="text-xs text-muted-foreground">Current Location</p>
              <p className="font-medium text-sm truncate max-w-[200px] group-hover:text-primary transition-colors">
                {defaultAddress?.address || "Select Address"}
              </p>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
          </motion.button>

          {/* Cart */}
          <Link href="/booking/summary">
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="relative p-2 bg-primary/10 hover:bg-primary/20 rounded-full transition-colors"
            >
              <ShoppingCart className="w-5 h-5 text-primary" />
              <AnimatePresence>
                {totalItems > 0 && (
                  <motion.span
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0, rotate: 180 }}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-success text-success-foreground text-xs font-bold rounded-full flex items-center justify-center"
                  >
                    {totalItems}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.div>
          </Link>
        </div>

        {/* Search */}
        <motion.div
          className="relative"
          animate={isSearchFocused ? { scale: 1.02 } : { scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search for services..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
            className="pl-12 h-12 bg-muted/50 border-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300"
          />
        </motion.div>
      </motion.header>

      {/* Hero Section */}
      <motion.section
        style={{ y }}
        className="relative px-4 py-12 bg-gradient-to-br from-primary/5 via-background to-success/5 overflow-hidden"
      >
        {/* Floating Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <FloatingElement delay={0}>
            <div className="absolute top-10 left-10 text-4xl opacity-20">✨</div>
          </FloatingElement>
          <FloatingElement delay={1}>
            <div className="absolute top-20 right-20 text-3xl opacity-20">💫</div>
          </FloatingElement>
          <FloatingElement delay={2}>
            <div className="absolute bottom-20 left-1/4 text-2xl opacity-20">⭐</div>
          </FloatingElement>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 100 }}
          className="max-w-lg mx-auto text-center relative z-10"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
            className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6"
          >
            <Sparkles className="w-4 h-4" />
            Trusted by 50,000+ customers
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight"
          >
            Professional Services
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
              className="block text-primary"
            >
              At Your Doorstep
            </motion.span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="text-muted-foreground mb-8 text-lg"
          >
            Book verified professionals for all your home and beauty needs with just a few taps
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-lg px-8 py-4 group">
              <motion.span
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                Book Now
              </motion.span>
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-4">
              <motion.span
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                Watch Demo
              </motion.span>
            </Button>
          </motion.div>
        </motion.div>
      </motion.section>

      {/* Trust Badges */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="px-4 py-8"
      >
        <motion.div
          variants={itemVariants}
          className="flex justify-center gap-8 flex-wrap"
        >
          {[
            { icon: Shield, label: "Verified Pros", color: "text-green-500" },
            { icon: Clock, label: "On-time Service", color: "text-blue-500" },
            { icon: Award, label: "Quality Assured", color: "text-purple-500" },
            { icon: Heart, label: "100% Satisfaction", color: "text-red-500" },
          ].map((item, index) => (
            <motion.div
              key={item.label}
              variants={itemVariants}
              whileHover={{ scale: 1.1, y: -5 }}
              className="flex items-center gap-2 bg-card px-4 py-3 rounded-xl border border-border shadow-sm"
            >
              <item.icon className={`w-5 h-5 ${item.color}`} />
              <span className="text-sm font-medium text-foreground">{item.label}</span>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* Categories */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="px-4 py-8"
      >
        <motion.div variants={itemVariants} className="text-center mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-2">Browse Categories</h2>
          <p className="text-muted-foreground">Find the perfect service for your needs</p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          className="grid grid-cols-2 gap-4"
        >
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              variants={itemVariants}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <Link href={`/services/${category.id}`}>
                <Card className={`${category.color} border-2 hover:shadow-xl transition-all duration-500 group overflow-hidden relative`}>
                  <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                  <CardContent className="p-4 relative z-10">
                    <motion.div
                      className="flex items-center gap-3 mb-2"
                      whileHover={{ x: 5 }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      <motion.div
                        className="text-3xl"
                        whileHover={{ scale: 1.2, rotate: 10 }}
                        transition={{ type: "spring", stiffness: 400 }}
                      >
                        {category.icon}
                      </motion.div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground text-sm group-hover:text-primary transition-colors">
                          {category.name}
                        </h3>
                        <p className="text-xs text-muted-foreground">{category.services}</p>
                      </div>
                    </motion.div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* Featured Workers */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="px-4 py-8 bg-muted/30"
      >
        <motion.div variants={itemVariants} className="text-center mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-2">Featured Professionals</h2>
          <p className="text-muted-foreground">Meet our top-rated service providers</p>
        </motion.div>

        <motion.div variants={containerVariants} className="space-y-4">
          {featuredWorkers.map((worker, index) => (
            <motion.div
              key={worker.id}
              variants={itemVariants}
              whileHover={{ scale: 1.02, x: 10 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <Card className="hover:shadow-xl transition-all duration-500 group overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <motion.div
                      className="relative"
                      whileHover={{ scale: 1.1 }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-success/20 rounded-full flex items-center justify-center text-2xl border-2 border-primary/20">
                        👤
                      </div>
                      {worker.verified && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.5 + index * 0.1, type: "spring", stiffness: 500 }}
                        >
                          <CheckCircle className="absolute -bottom-1 -right-1 w-5 h-5 text-success bg-background rounded-full border-2 border-background" />
                        </motion.div>
                      )}
                      {worker.badge && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.7 + index * 0.1 }}
                          className="absolute -top-2 -right-2"
                        >
                          <Badge className="bg-primary text-primary-foreground text-xs">
                            {worker.badge}
                          </Badge>
                        </motion.div>
                      )}
                    </motion.div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                          {worker.name}
                        </h3>
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">{worker.specialty}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <motion.div
                          className="flex items-center gap-1"
                          whileHover={{ scale: 1.1 }}
                        >
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          <span className="font-medium">{worker.rating}</span>
                          <span>({worker.reviews})</span>
                        </motion.div>
                        <span>{worker.experience}</span>
                      </div>
                    </div>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button size="sm" variant="outline" className="group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        Book
                      </Button>
                    </motion.div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* Testimonials */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="px-4 py-12"
      >
        <motion.div variants={itemVariants} className="text-center mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-2">What Our Customers Say</h2>
          <p className="text-muted-foreground">Real experiences from satisfied customers</p>
        </motion.div>

        <div className="max-w-2xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTestimonial}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="text-center"
            >
              <Card className="bg-gradient-to-br from-primary/5 to-success/5 border-primary/20">
                <CardContent className="p-6">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 500 }}
                    className="flex justify-center mb-4"
                  >
                    {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 + i * 0.1, type: "spring", stiffness: 500 }}
                      >
                        <Star className="w-5 h-5 fill-yellow-400 text-yellow-400 inline-block" />
                      </motion.div>
                    ))}
                  </motion.div>
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="text-foreground italic text-lg mb-4"
                  >
                    "{testimonials[currentTestimonial].comment}"
                  </motion.p>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="flex items-center justify-center gap-3"
                  >
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-xl">
                      👤
                    </div>
                    <div className="text-left">
                      <h4 className="font-semibold text-foreground">{testimonials[currentTestimonial].name}</h4>
                      <p className="text-sm text-muted-foreground">{testimonials[currentTestimonial].location}</p>
                    </div>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.0 }}
            className="flex justify-center gap-2 mt-6"
          >
            {testimonials.map((_, index) => (
              <motion.button
                key={index}
                onClick={() => setCurrentTestimonial(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentTestimonial ? 'bg-primary' : 'bg-muted-foreground/30'
                }`}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              />
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Stats */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="px-4 py-12 bg-gradient-to-r from-primary/5 via-success/5 to-primary/5"
      >
        <motion.div variants={itemVariants} className="text-center mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-2">Trusted by Thousands</h2>
          <p className="text-muted-foreground">Join our growing community of satisfied customers</p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          className="grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              variants={itemVariants}
              whileHover={{ scale: 1.05, y: -5 }}
              className="text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ delay: index * 0.1, type: "spring", stiffness: 200 }}
                className="flex justify-center mb-3"
              >
                <stat.icon className={`w-8 h-8 ${stat.color}`} />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                className="text-3xl font-bold text-foreground mb-1"
              >
                {stat.value}
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="text-sm text-muted-foreground"
              >
                {stat.label}
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ type: "spring", stiffness: 100 }}
        className="px-4 py-12 text-center"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="max-w-md mx-auto"
        >
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-muted-foreground mb-6">
            Download our app and experience premium home services like never before
          </p>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button size="lg" className="bg-primary hover:bg-primary/90 px-8 py-4 text-lg">
              <Zap className="w-5 h-5 mr-2" />
              Get Started Now
            </Button>
          </motion.div>
        </motion.div>
      </motion.section>
    </div>
  );
}
