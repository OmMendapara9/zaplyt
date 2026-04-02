"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Search,
  Star,
  Shield,
  Clock,
  Award,
  Users,
  ArrowRight,
  CheckCircle,
  Sparkles,
  Zap,
  Heart,
  TrendingUp,
  Phone,
  Mail,
  Calendar,
  DollarSign
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const categories = [
  {
    id: "electrician",
    name: "Electrician",
    icon: "⚡",
    color: "bg-gradient-to-br from-blue-50 to-purple-50 border-blue-100 hover:shadow-lg",
    services: "70+ services"
  },
  {
    id: "plumber",
    name: "Plumber",
    icon: "🔧",
    color: "bg-gradient-to-br from-purple-50 to-green-50 border-purple-100 hover:shadow-lg",
    services: "60+ services"
  },
  {
    id: "ac-service",
    name: "AC Repair",
    icon: "❄️",
    color: "bg-gradient-to-br from-green-50 to-blue-50 border-green-100 hover:shadow-lg",
    services: "50+ services"
  },
  {
    id: "cleaning",
    name: "Cleaning",
    icon: "🧹",
    color: "bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-100 hover:shadow-lg",
    services: "90+ services"
  },
  {
    id: "painter",
    name: "Painter",
    icon: "🎨",
    color: "bg-gradient-to-br from-purple-50 to-pink-50 border-purple-100 hover:shadow-lg",
    services: "40+ services"
  },
  {
    id: "carpenter",
    name: "Carpenter",
    icon: "🔨",
    color: "bg-gradient-to-br from-orange-50 to-red-50 border-orange-100 hover:shadow-lg",
    services: "55+ services"
  },
];

const featuredWorkers = [
  {
    id: "1",
    name: "Rajesh Kumar",
    specialty: "Electrician",
    rating: 4.9,
    reviews: 234,
    experience: "7 years",
    price: "₹299",
    image: "/images/worker1.jpg",
    verified: true,
    badge: "Top Rated",
    phone: "+91 98765 43210"
  },
  {
    id: "2",
    name: "Priya Sharma",
    specialty: "AC Technician",
    rating: 4.8,
    reviews: 189,
    experience: "5 years",
    price: "₹499",
    image: "/images/worker2.jpg",
    verified: true,
    badge: "Expert",
    phone: "+91 87654 32109"
  },
  {
    id: "3",
    name: "Amit Singh",
    specialty: "Plumber",
    rating: 4.9,
    reviews: 312,
    experience: "8 years",
    price: "₹249",
    image: "/images/worker3.jpg",
    verified: true,
    badge: "Verified",
    phone: "+91 76543 21098"
  },
];

const testimonials = [
  {
    id: "1",
    name: "Sarah Johnson",
    service: "Home Cleaning",
    rating: 5,
    comment: "Amazing service! The cleaner was professional and thorough. Will definitely book again.",
    location: "Mumbai",
    image: "/images/testimonial1.jpg",
  },
  {
    id: "2",
    name: "Mike Chen",
    service: "AC Repair",
    rating: 5,
    comment: "Fixed my AC in no time. Very knowledgeable and friendly. Highly recommended!",
    location: "Delhi",
    image: "/images/testimonial2.jpg",
  },
  {
    id: "3",
    name: "Emma Wilson",
    service: "Beauty Service",
    rating: 5,
    comment: "Best salon experience ever! The stylist was amazing and the results were perfect.",
    location: "Bangalore",
    image: "/images/testimonial3.jpg",
  },
];

const stats = [
  { value: "50K+", label: "Happy Customers", icon: Users, color: "text-blue-500" },
  { value: "10K+", label: "Verified Workers", icon: Shield, color: "text-purple-500" },
  { value: "100+", label: "Services", icon: Sparkles, color: "text-green-500" },
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
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -50]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleGetStarted = () => {
    if (isAuthenticated) {
      router.push("/home");
    } else {
      router.push("/onboarding");
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] overflow-x-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.03, 0.06, 0.03],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-20 right-10 w-32 h-32 bg-gradient-to-br from-blue-200/20 to-purple-200/20 rounded-full blur-xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.03, 0.05, 0.03],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
          className="absolute bottom-40 left-10 w-24 h-24 bg-gradient-to-br from-purple-200/20 to-green-200/20 rounded-full blur-xl"
        />
      </div>

      {/* Navigation */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className="bg-white/95 backdrop-blur-xl border-b border-gray-100/50 px-4 py-4 sticky top-0 z-50 shadow-lg shadow-gray-100/20"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-3 group cursor-pointer"
            onClick={() => router.push("/")}
          >
            <motion.div
              whileHover={{ rotate: [0, -5, 5, 0] }}
              transition={{ duration: 0.5 }}
              className="w-12 h-12 bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 rounded-xl flex items-center justify-center shadow-xl shadow-blue-500/25 group-hover:shadow-2xl group-hover:shadow-blue-500/40 transition-all duration-300"
            >
              <Zap className="w-6 h-6 text-white drop-shadow-sm" />
            </motion.div>
            <motion.span
              className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 bg-clip-text text-transparent tracking-tight group-hover:from-blue-700 group-hover:via-purple-700 group-hover:to-green-700 transition-all duration-300"
              whileHover={{ scale: 1.02 }}
            >
              Zaplyt
            </motion.span>
          </motion.div>

          <div className="hidden md:flex items-center gap-8">
            <motion.a
              href="#services"
              className="text-[#64748B] hover:text-[#0F172A] transition-all duration-300 font-medium hover:scale-105 relative group px-3 py-2 rounded-lg hover:bg-gray-50/50"
              whileHover={{ y: -2 }}
            >
              Services
              <motion.span
                className="absolute -bottom-1 left-1/2 w-0 h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 group-hover:w-full transition-all duration-300 origin-center"
                initial={{ x: "-50%" }}
              />
            </motion.a>
            <motion.a
              href="#workers"
              className="text-[#64748B] hover:text-[#0F172A] transition-all duration-300 font-medium hover:scale-105 relative group px-3 py-2 rounded-lg hover:bg-gray-50/50"
              whileHover={{ y: -2 }}
            >
              Professionals
              <motion.span
                className="absolute -bottom-1 left-1/2 w-0 h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 group-hover:w-full transition-all duration-300 origin-center"
                initial={{ x: "-50%" }}
              />
            </motion.a>
            <motion.a
              href="#about"
              className="text-[#64748B] hover:text-[#0F172A] transition-all duration-300 font-medium hover:scale-105 relative group px-3 py-2 rounded-lg hover:bg-gray-50/50"
              whileHover={{ y: -2 }}
            >
              About
              <motion.span
                className="absolute -bottom-1 left-1/2 w-0 h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 group-hover:w-full transition-all duration-300 origin-center"
                initial={{ x: "-50%" }}
              />
            </motion.a>
            <motion.a
              href="#contact"
              className="text-[#64748B] hover:text-[#0F172A] transition-all duration-300 font-medium hover:scale-105 relative group px-3 py-2 rounded-lg hover:bg-gray-50/50"
              whileHover={{ y: -2 }}
            >
              Contact
              <motion.span
                className="absolute -bottom-1 left-1/2 w-0 h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 group-hover:w-full transition-all duration-300 origin-center"
                initial={{ x: "-50%" }}
              />
            </motion.a>
          </div>

          <div className="flex items-center gap-4">
            <motion.div whileHover={{ scale: 1.05 }}>
              <Button
                variant="ghost"
                className="text-[#64748B] hover:text-[#0F172A] hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50/50 transition-all duration-300 font-medium rounded-xl px-6 py-2"
                onClick={() => router.push("/login")}
              >
                Sign In
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={handleGetStarted}
                className="bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 hover:from-blue-600 hover:via-purple-600 hover:to-green-600 text-white shadow-xl shadow-blue-500/25 hover:shadow-2xl hover:shadow-blue-500/40 transition-all duration-300 transform hover:scale-105 rounded-xl font-semibold px-8 py-3"
              >
                Get Started
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <motion.section
        style={{ y }}
        className="relative px-4 py-24 bg-gradient-to-br from-blue-50/60 via-purple-50/60 to-green-50/60 overflow-hidden"
      >
        {/* Enhanced Floating Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <FloatingElement delay={0}>
            <div className="absolute top-16 left-12 text-5xl opacity-8 animate-pulse">✨</div>
          </FloatingElement>
          <FloatingElement delay={1}>
            <div className="absolute top-28 right-16 text-4xl opacity-8 animate-pulse">💫</div>
          </FloatingElement>
          <FloatingElement delay={2}>
            <div className="absolute bottom-40 left-1/3 text-3xl opacity-8 animate-pulse">⭐</div>
          </FloatingElement>
          <FloatingElement delay={3}>
            <div className="absolute top-1/2 right-8 text-2xl opacity-6 animate-pulse">🌟</div>
          </FloatingElement>
        </div>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-4xl mx-auto text-center mb-8"
        >
          <div className="flex flex-wrap justify-center items-center gap-6 mb-6">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2 bg-white/90 backdrop-blur-sm text-[#0F172A] px-4 py-2 rounded-full text-sm font-medium shadow-lg border border-gray-100"
            >
              <Shield className="w-4 h-4 text-green-500" />
              100% Verified Workers
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2 bg-white/90 backdrop-blur-sm text-[#0F172A] px-4 py-2 rounded-full text-sm font-medium shadow-lg border border-gray-100"
            >
              <Star className="w-4 h-4 text-yellow-500" />
              4.9/5 Average Rating
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2 bg-white/90 backdrop-blur-sm text-[#0F172A] px-4 py-2 rounded-full text-sm font-medium shadow-lg border border-gray-100"
            >
              <Clock className="w-4 h-4 text-blue-500" />
              Same Day Service
            </motion.div>
          </div>
        </motion.div>

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-green-500/10 backdrop-blur-sm text-[#0F172A] px-6 py-3 rounded-full text-sm font-semibold mb-8 shadow-xl border border-white/20"
          >
            <Sparkles className="w-5 h-5 text-blue-500 animate-pulse" />
            Trusted by 50,000+ customers across India
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, type: "spring", stiffness: 100 }}
            className="text-6xl md:text-8xl font-bold text-[#0F172A] mb-8 leading-tight"
          >
            Book Trusted
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
              className="block bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 bg-clip-text text-transparent animate-pulse"
            >
              Workers Near You
            </motion.span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="text-[#64748B] mb-12 text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed font-medium"
          >
            Connect with verified professionals for all your home and business needs.
            Quality service, guaranteed satisfaction, at your fingertips.
          </motion.p>

          {/* Enhanced Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="max-w-lg mx-auto mb-10"
          >
            <div className="relative group">
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-green-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"
                animate={{ scale: [1, 1.02, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <div className="relative bg-white/95 backdrop-blur-xl border border-gray-200/50 rounded-2xl shadow-2xl group-hover:shadow-3xl group-hover:border-blue-300/50 transition-all duration-300">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-[#64748B] group-hover:text-blue-500 transition-colors" />
                <Input
                  type="text"
                  placeholder="Search for services like 'electrician', 'plumber', 'cleaning'..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-14 h-16 bg-transparent border-0 focus:ring-0 text-lg rounded-2xl placeholder:text-[#94A3B8] font-medium"
                />
                <motion.div
                  className="absolute right-4 top-1/2 -translate-y-1/2"
                  whileHover={{ scale: 1.1 }}
                >
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-xl px-6 shadow-lg"
                  >
                    Search
                  </Button>
                </motion.div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                size="lg"
                onClick={handleGetStarted}
                className="bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 hover:from-blue-600 hover:via-purple-600 hover:to-green-600 text-white text-xl px-12 py-6 group shadow-2xl hover:shadow-3xl shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-500 transform hover:scale-105 rounded-2xl font-bold"
              >
                <motion.span
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  Book Now
                </motion.span>
                <ArrowRight className="w-7 h-7 ml-3 group-hover:translate-x-2 transition-transform" />
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }}>
              <Button
                variant="outline"
                size="lg"
                className="border-2 border-gray-200 hover:border-blue-300 bg-white/80 backdrop-blur-sm text-[#0F172A] hover:bg-blue-50/50 text-lg px-8 py-6 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Explore Services
              </Button>
            </motion.div>
          </motion.div>

          {/* Social Proof */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="mt-16 flex flex-col items-center gap-4"
          >
            <p className="text-[#64748B] text-sm font-medium">Trusted by leading companies</p>
            <div className="flex items-center gap-8 opacity-60">
              <motion.div whileHover={{ scale: 1.1, opacity: 0.8 }} className="text-2xl font-bold text-gray-400">🏢</motion.div>
              <motion.div whileHover={{ scale: 1.1, opacity: 0.8 }} className="text-2xl font-bold text-gray-400">🏪</motion.div>
              <motion.div whileHover={{ scale: 1.1, opacity: 0.8 }} className="text-2xl font-bold text-gray-400">🏬</motion.div>
              <motion.div whileHover={{ scale: 1.1, opacity: 0.8 }} className="text-2xl font-bold text-gray-400">🏭</motion.div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Trust Badges */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="px-4 py-12"
      >
        <motion.div
          variants={itemVariants}
          className="flex justify-center gap-12 flex-wrap"
        >
          {[
            { icon: Shield, label: "Verified Pros", color: "text-blue-500" },
            { icon: Clock, label: "On-time Service", color: "text-purple-500" },
            { icon: Award, label: "Quality Assured", color: "text-green-500" },
            { icon: Heart, label: "100% Satisfaction", color: "text-red-500" },
          ].map((item, index) => (
            <motion.div
              key={item.label}
              variants={itemVariants}
              whileHover={{ scale: 1.1, y: -5 }}
              className="flex items-center gap-3 bg-white px-6 py-4 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300"
            >
              <item.icon className={`w-6 h-6 ${item.color}`} />
              <span className="text-sm font-medium text-[#0F172A]">{item.label}</span>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* Categories Section */}
      <motion.section
        id="services"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="px-4 py-20 bg-gradient-to-br from-gray-50/50 to-blue-50/30"
      >
        <motion.div variants={itemVariants} className="text-center mb-16">
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-green-500/10 backdrop-blur-sm text-[#0F172A] px-6 py-3 rounded-full text-sm font-semibold mb-6 shadow-lg border border-white/20"
          >
            <Sparkles className="w-5 h-5 text-blue-500 animate-pulse" />
            100+ Services Available
          </motion.div>
          <h2 className="text-4xl md:text-5xl font-bold text-[#0F172A] mb-6 leading-tight">
            Popular
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 bg-clip-text text-transparent"> Services</span>
          </h2>
          <p className="text-[#64748B] text-xl max-w-3xl mx-auto leading-relaxed">
            Find the perfect professional for any job, from home repairs to beauty services.
            All our workers are verified and background-checked.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-8"
        >
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              variants={itemVariants}
              whileHover={{
                scale: 1.08,
                y: -12,
                rotateY: 5,
                z: 50
              }}
              whileTap={{ scale: 0.95 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 20,
                hover: { duration: 0.3 }
              }}
              className="group cursor-pointer"
            >
              <Card className={`${category.color} border-2 border-gray-100/50 hover:border-blue-200/50 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 group overflow-hidden relative transform rounded-3xl backdrop-blur-sm bg-white/80`}>
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-green-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />
                <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />

                <CardContent className="p-8 relative z-10 text-center">
                  <motion.div
                    className="text-6xl mb-6 mx-auto w-20 h-20 flex items-center justify-center rounded-2xl bg-gradient-to-br from-white/50 to-white/30 backdrop-blur-sm border border-white/20 shadow-lg group-hover:shadow-xl transition-all duration-300"
                    whileHover={{
                      scale: 1.15,
                      rotate: [0, -5, 5, 0],
                      transition: { duration: 0.5 }
                    }}
                  >
                    {category.icon}
                  </motion.div>

                  <motion.h3
                    className="font-bold text-[#0F172A] text-xl mb-3 group-hover:text-blue-600 transition-colors duration-300"
                    whileHover={{ scale: 1.05 }}
                  >
                    {category.name}
                  </motion.h3>

                  <motion.p
                    className="text-sm text-[#64748B] font-medium mb-4"
                    whileHover={{ scale: 1.02 }}
                  >
                    {category.services}
                  </motion.p>

                  <motion.div
                    className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    initial={{ y: 10 }}
                    whileHover={{ y: 0 }}
                  >
                    <ArrowRight className="w-4 h-4 text-blue-500 group-hover:translate-x-1 transition-transform" />
                    <span className="text-sm font-semibold text-blue-600">Explore</span>
                  </motion.div>
                </CardContent>

                {/* Animated border gradient */}
                <div className="absolute inset-0 rounded-3xl p-[2px] bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-green-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="w-full h-full bg-white/90 rounded-3xl" />
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Call to action */}
        <motion.div
          variants={itemVariants}
          className="text-center mt-16"
        >
          <motion.div whileHover={{ scale: 1.05 }}>
            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 hover:from-blue-600 hover:via-purple-600 hover:to-green-600 text-white text-lg px-12 py-6 shadow-2xl hover:shadow-3xl shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-500 transform hover:scale-105 rounded-2xl font-bold"
              onClick={() => document.getElementById('workers')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <Users className="w-6 h-6 mr-3" />
              View All Professionals
              <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform" />
            </Button>
          </motion.div>
        </motion.div>
      </motion.section>

      {/* Featured Workers Section */}
      <motion.section
        id="workers"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="px-4 py-16 bg-white"
      >
        <motion.div variants={itemVariants} className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[#0F172A] mb-4">Featured Professionals</h2>
          <p className="text-[#64748B] text-lg max-w-2xl mx-auto">
            Meet our top-rated service providers, verified and ready to help
          </p>
        </motion.div>

        <motion.div variants={containerVariants} className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
          {featuredWorkers.map((worker, index) => (
            <motion.div
              key={worker.id}
              variants={itemVariants}
              whileHover={{ scale: 1.02, y: -10 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <Card className="bg-white border border-gray-100 shadow-lg hover:shadow-2xl transition-all duration-500 group overflow-hidden rounded-2xl">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <motion.div
                      className="relative"
                      whileHover={{ scale: 1.1 }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center text-2xl border-2 border-gray-100">
                        👤
                      </div>
                      {worker.verified && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.5 + index * 0.1, type: "spring", stiffness: 500 }}
                        >
                          <CheckCircle className="absolute -bottom-1 -right-1 w-5 h-5 text-green-500 bg-white rounded-full border-2 border-white shadow-sm" />
                        </motion.div>
                      )}
                      {worker.badge && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.7 + index * 0.1 }}
                          className="absolute -top-2 -right-2"
                        >
                          <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs shadow-sm">
                            {worker.badge}
                          </Badge>
                        </motion.div>
                      )}
                    </motion.div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-[#0F172A] text-lg mb-1 group-hover:text-blue-600 transition-colors">
                        {worker.name}
                      </h3>
                      <p className="text-[#64748B] text-sm mb-2">{worker.specialty}</p>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-medium text-[#0F172A]">{worker.rating}</span>
                          <span className="text-[#64748B] text-sm">({worker.reviews})</span>
                        </div>
                      </div>
                      <p className="text-[#64748B] text-sm">{worker.experience}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-green-500" />
                      <span className="text-2xl font-bold text-[#0F172A]">{worker.price}</span>
                      <span className="text-[#64748B] text-sm">/service</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                      onClick={handleGetStarted}
                    >
                      Hire Now
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-gray-200 text-[#64748B] hover:bg-gray-50"
                    >
                      <Phone className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* Testimonials Section */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="px-4 py-16"
      >
        <motion.div variants={itemVariants} className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[#0F172A] mb-4">What Our Customers Say</h2>
          <p className="text-[#64748B] text-lg">Real experiences from satisfied customers</p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTestimonial}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="text-center"
            >
              <Card className="bg-gradient-to-br from-white to-gray-50 border border-gray-100 shadow-xl rounded-2xl">
                <CardContent className="p-8">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 500 }}
                    className="flex justify-center mb-6"
                  >
                    {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 + i * 0.1, type: "spring", stiffness: 500 }}
                      >
                        <Star className="w-6 h-6 fill-yellow-400 text-yellow-400 inline-block mx-1" />
                      </motion.div>
                    ))}
                  </motion.div>
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="text-[#0F172A] italic text-xl mb-6 leading-relaxed"
                  >
                    "{testimonials[currentTestimonial].comment}"
                  </motion.p>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="flex items-center justify-center gap-4"
                  >
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center text-2xl border-2 border-gray-100">
                      👤
                    </div>
                    <div className="text-left">
                      <h4 className="font-semibold text-[#0F172A] text-lg">{testimonials[currentTestimonial].name}</h4>
                      <p className="text-[#64748B]">{testimonials[currentTestimonial].location}</p>
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
            className="flex justify-center gap-3 mt-8"
          >
            {testimonials.map((_, index) => (
              <motion.button
                key={index}
                onClick={() => setCurrentTestimonial(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentTestimonial ? 'bg-gradient-to-r from-blue-500 to-purple-500' : 'bg-gray-300'
                }`}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              />
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Stats Section */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="px-4 py-16 bg-gradient-to-r from-blue-50 via-purple-50 to-green-50"
      >
        <motion.div variants={itemVariants} className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[#0F172A] mb-4">Trusted by Thousands</h2>
          <p className="text-[#64748B] text-lg">Join our growing community of satisfied customers</p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8"
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
                className="flex justify-center mb-4"
              >
                <stat.icon className={`w-10 h-10 ${stat.color}`} />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                className="text-4xl font-bold text-[#0F172A] mb-2"
              >
                {stat.value}
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="text-[#64748B] font-medium"
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
        className="px-4 py-20 text-center"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="max-w-2xl mx-auto"
        >
          <h2 className="text-4xl font-bold text-[#0F172A] mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-[#64748B] mb-8 text-xl leading-relaxed">
            Join thousands of satisfied customers who trust Zaplyt for their service needs.
            Download our app and experience premium home services like never before.
          </p>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              size="lg"
              onClick={handleGetStarted}
              className="bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 hover:from-blue-600 hover:via-purple-600 hover:to-green-600 text-white px-12 py-6 text-xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 rounded-xl"
            >
              <Zap className="w-6 h-6 mr-3" />
              Get Started Now
            </Button>
          </motion.div>
        </motion.div>
      </motion.section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                  <Zap className="w-4 h-4 text-white" />
                </div>
                <span className="text-xl font-bold text-[#0F172A]">Zaplyt</span>
              </div>
              <p className="text-[#64748B] mb-4">
                Connecting you with verified professionals for all your service needs.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-[#0F172A] mb-4">Services</h3>
              <ul className="space-y-2 text-[#64748B]">
                <li><a href="#" className="hover:text-[#0F172A] transition-colors">Home Cleaning</a></li>
                <li><a href="#" className="hover:text-[#0F172A] transition-colors">AC Repair</a></li>
                <li><a href="#" className="hover:text-[#0F172A] transition-colors">Electrician</a></li>
                <li><a href="#" className="hover:text-[#0F172A] transition-colors">Plumbing</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-[#0F172A] mb-4">Company</h3>
              <ul className="space-y-2 text-[#64748B]">
                <li><a href="#" className="hover:text-[#0F172A] transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-[#0F172A] transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-[#0F172A] transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-[#0F172A] transition-colors">Support</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-[#0F172A] mb-4">Contact</h3>
              <div className="space-y-2 text-[#64748B]">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span>hello@zaplyt.com</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <span>+91 98765 43210</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-8 text-center text-[#64748B]">
            <p>&copy; 2024 Zaplyt. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
