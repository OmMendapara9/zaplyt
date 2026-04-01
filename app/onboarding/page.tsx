"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { ChevronRight } from "lucide-react";

const onboardingSlides = [
  {
    image: "/images/onboarding-1.jpg",
    title: "Expert Home Services",
    description: "Book professional services for salon, cleaning, repairs and more at your doorstep",
  },
  {
    image: "/images/onboarding-2.jpg",
    title: "Verified Professionals",
    description: "All our service providers are background verified and trained experts",
  },
  {
    image: "/images/onboarding-3.jpg",
    title: "Easy Booking & Payment",
    description: "Book services in seconds and pay securely with multiple payment options",
  },
];

export default function OnboardingPage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const router = useRouter();

  const handleNext = () => {
    if (currentSlide < onboardingSlides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      router.push("/login");
    }
  };

  const handleSkip = () => {
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Skip button */}
      <div className="absolute top-4 right-4 z-10">
        <button
          onClick={handleSkip}
          className="text-muted-foreground text-sm font-medium px-4 py-2"
        >
          Skip
        </button>
      </div>

      {/* Image section */}
      <div className="relative h-[55%] min-h-[320px] bg-muted overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0"
          >
            <Image
              src={onboardingSlides[currentSlide].image}
              alt={onboardingSlides[currentSlide].title}
              fill
              className="object-cover"
              priority
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Content section */}
      <div className="flex-1 flex flex-col px-6 pt-6 pb-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="flex-1"
          >
            <h1 className="text-2xl font-bold text-foreground mb-3 text-balance">
              {onboardingSlides[currentSlide].title}
            </h1>
            <p className="text-muted-foreground leading-relaxed text-pretty">
              {onboardingSlides[currentSlide].description}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Dots indicator */}
        <div className="flex justify-center gap-2 my-8">
          {onboardingSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? "w-8 bg-primary"
                  : "w-2 bg-muted-foreground/30"
              }`}
            />
          ))}
        </div>

        {/* Next button */}
        <button
          onClick={handleNext}
          className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-semibold flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
        >
          {currentSlide === onboardingSlides.length - 1 ? "Get Started" : "Next"}
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
