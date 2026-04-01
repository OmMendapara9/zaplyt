import { NextResponse } from "next/server";
import { connectToDatabase as dbConnect } from "@/lib/mongodb";
import User from "@/models/User";
import Service from "@/models/Service";
import Provider from "@/models/Provider";
import Booking from "@/models/Booking";
import bcrypt from "bcryptjs";

const services = [
  // Salon for Women - Facial for Glow
  {
    name: "Gold Facial",
    category: "Salon for Women",
    subcategory: "Facial for Glow",
    description: "Luxurious gold facial treatment for radiant and glowing skin. Includes cleansing, scrubbing, massage, and gold mask application.",
    price: 1499,
    duration: 60,
    image: "/images/gold-facial.jpg",
    rating: 4.8,
    reviews: 256,
    includes: ["Deep cleansing", "Exfoliation", "Gold serum application", "Face massage", "Gold mask", "Moisturizer"],
    benefits: ["Instant glow", "Anti-aging", "Skin tightening", "Even skin tone"],
    isPopular: true,
  },
  {
    name: "Diamond Facial",
    category: "Salon for Women",
    subcategory: "Facial for Glow",
    description: "Premium diamond facial for ultimate skin rejuvenation. Diamond dust exfoliation followed by intensive treatment.",
    price: 1999,
    duration: 75,
    image: "/images/diamond-facial.jpg",
    rating: 4.9,
    reviews: 189,
    includes: ["Diamond exfoliation", "Deep pore cleansing", "Serum application", "Face massage", "Diamond mask", "SPF moisturizer"],
    benefits: ["Deep cleansing", "Brightening", "Anti-wrinkle", "Hydration"],
    isPopular: true,
  },
  {
    name: "Fruit Facial",
    category: "Salon for Women",
    subcategory: "Facial for Glow",
    description: "Natural fruit-based facial packed with vitamins and antioxidants for fresh, healthy skin.",
    price: 799,
    duration: 45,
    image: "/images/facial.jpg",
    rating: 4.6,
    reviews: 342,
    includes: ["Fruit cleansing", "Natural scrub", "Fruit pack", "Face massage", "Toner", "Moisturizer"],
    benefits: ["Natural glow", "Vitamin enrichment", "Refreshing", "Suitable for all skin types"],
  },
  {
    name: "Pearl Facial",
    category: "Salon for Women",
    subcategory: "Facial for Glow",
    description: "Pearl essence facial for fair and luminous skin. Pearl extracts provide natural whitening.",
    price: 1299,
    duration: 60,
    image: "/images/facial.jpg",
    rating: 4.7,
    reviews: 198,
    includes: ["Pearl cleansing", "Whitening scrub", "Pearl serum", "Face massage", "Pearl mask", "Brightening cream"],
    benefits: ["Skin whitening", "Luminous glow", "Soft texture", "Even complexion"],
  },
  // Salon for Women - Waxing
  {
    name: "Full Arms Waxing",
    category: "Salon for Women",
    subcategory: "Waxing",
    description: "Complete arms waxing using premium quality wax for smooth, hair-free arms.",
    price: 299,
    duration: 20,
    image: "/images/waxing.jpg",
    rating: 4.5,
    reviews: 567,
    includes: ["Pre-wax cleansing", "Full arm waxing", "Post-wax soothing lotion"],
    benefits: ["Smooth skin", "Long-lasting results", "Minimal irritation"],
  },
  {
    name: "Full Legs Waxing",
    category: "Salon for Women",
    subcategory: "Waxing",
    description: "Complete legs waxing from thigh to toe using gentle wax formula.",
    price: 499,
    duration: 30,
    image: "/images/waxing.jpg",
    rating: 4.6,
    reviews: 423,
    includes: ["Pre-wax prep", "Full leg waxing", "Soothing gel application"],
    benefits: ["Silky smooth legs", "Even skin", "Reduced hair growth over time"],
  },
  {
    name: "Full Body Waxing",
    category: "Salon for Women",
    subcategory: "Waxing",
    description: "Complete body waxing package including arms, legs, underarms, and more.",
    price: 1499,
    duration: 90,
    image: "/images/waxing.jpg",
    rating: 4.7,
    reviews: 234,
    includes: ["Full arms", "Full legs", "Underarms", "Stomach", "Back", "Post-wax care"],
    benefits: ["Complete smoothness", "Saves time", "Package discount"],
    isPopular: true,
  },
  // Salon for Women - Manicure & Pedicure
  {
    name: "Classic Manicure",
    category: "Salon for Women",
    subcategory: "Manicure & Pedicure",
    description: "Classic manicure with nail shaping, cuticle care, and polish application.",
    price: 399,
    duration: 30,
    image: "/images/manicure.jpg",
    rating: 4.5,
    reviews: 312,
    includes: ["Nail shaping", "Cuticle care", "Hand massage", "Base coat", "Color polish", "Top coat"],
    benefits: ["Well-groomed nails", "Soft hands", "Relaxation"],
  },
  {
    name: "Spa Pedicure",
    category: "Salon for Women",
    subcategory: "Manicure & Pedicure",
    description: "Luxurious spa pedicure with foot soak, scrub, massage, and nail care.",
    price: 599,
    duration: 45,
    image: "/images/pedicure.jpg",
    rating: 4.7,
    reviews: 278,
    includes: ["Foot soak", "Dead skin removal", "Scrubbing", "Foot mask", "Massage", "Nail polish"],
    benefits: ["Relaxed feet", "Smooth heels", "Rejuvenation"],
    isPopular: true,
  },
  // AC & Appliance Repair
  {
    name: "AC Regular Service",
    category: "AC & Appliance Repair",
    subcategory: "AC Service",
    description: "Complete AC servicing including filter cleaning, gas check, and general maintenance.",
    price: 499,
    duration: 45,
    image: "/images/ac-service.jpg",
    rating: 4.6,
    reviews: 892,
    includes: ["Filter cleaning", "Coil cleaning", "Gas pressure check", "General inspection", "Performance test"],
    benefits: ["Improved cooling", "Energy efficiency", "Extended AC life"],
    isPopular: true,
  },
  {
    name: "AC Deep Cleaning",
    category: "AC & Appliance Repair",
    subcategory: "AC Service",
    description: "Thorough deep cleaning of AC unit with foam jet cleaning technology.",
    price: 899,
    duration: 90,
    image: "/images/ac-service.jpg",
    rating: 4.8,
    reviews: 534,
    includes: ["Complete disassembly", "Foam jet cleaning", "Coil deep clean", "Drain cleaning", "Sanitization", "Reassembly"],
    benefits: ["Fresh air", "Better cooling", "Odor removal", "Bacteria elimination"],
  },
  {
    name: "AC Gas Refill",
    category: "AC & Appliance Repair",
    subcategory: "AC Service",
    description: "AC gas top-up or complete refill with leak detection.",
    price: 1499,
    duration: 60,
    image: "/images/ac-service.jpg",
    rating: 4.5,
    reviews: 345,
    includes: ["Leak detection", "Gas refill", "Pressure testing", "Performance check"],
    benefits: ["Optimal cooling", "Energy saving", "Proper functioning"],
  },
  // Cleaning Services
  {
    name: "Bathroom Deep Cleaning",
    category: "Cleaning",
    subcategory: "Bathroom Cleaning",
    description: "Thorough bathroom cleaning including tiles, fixtures, and sanitization.",
    price: 499,
    duration: 60,
    image: "/images/cleaning.jpg",
    rating: 4.7,
    reviews: 623,
    includes: ["Tile scrubbing", "Grout cleaning", "Fixture polishing", "Toilet sanitization", "Mirror cleaning", "Floor mopping"],
    benefits: ["Sparkling clean", "Germ-free", "Fresh fragrance"],
  },
  {
    name: "Kitchen Deep Cleaning",
    category: "Cleaning",
    subcategory: "Kitchen Cleaning",
    description: "Complete kitchen cleaning including chimney, cabinets, and appliances.",
    price: 799,
    duration: 90,
    image: "/images/cleaning.jpg",
    rating: 4.8,
    reviews: 456,
    includes: ["Chimney cleaning", "Cabinet degreasing", "Countertop cleaning", "Sink sanitization", "Appliance exterior", "Floor cleaning"],
    benefits: ["Grease-free kitchen", "Hygienic cooking space", "Organized look"],
    isPopular: true,
  },
  {
    name: "Full Home Deep Cleaning",
    category: "Cleaning",
    subcategory: "Home Cleaning",
    description: "Complete home deep cleaning for 2BHK/3BHK apartments.",
    price: 2499,
    duration: 240,
    image: "/images/cleaning.jpg",
    rating: 4.9,
    reviews: 312,
    includes: ["All rooms", "Kitchen deep clean", "Bathroom deep clean", "Balcony", "Windows", "Furniture dusting"],
    benefits: ["Spotless home", "Healthy environment", "Time saving"],
  },
];

const providers = [
  {
    name: "Priya Sharma",
    phone: "+919876543210",
    email: "priya.sharma@zaplyt.com",
    specializations: ["Salon for Women"],
    rating: 4.9,
    totalReviews: 234,
    completedJobs: 567,
    isVerified: true,
    isAvailable: true,
  },
  {
    name: "Anjali Patel",
    phone: "+919876543211",
    email: "anjali.patel@zaplyt.com",
    specializations: ["Salon for Women"],
    rating: 4.8,
    totalReviews: 189,
    completedJobs: 423,
    isVerified: true,
    isAvailable: true,
  },
  {
    name: "Rajesh Kumar",
    phone: "+919876543212",
    email: "rajesh.kumar@zaplyt.com",
    specializations: ["AC & Appliance Repair"],
    rating: 4.7,
    totalReviews: 312,
    completedJobs: 789,
    isVerified: true,
    isAvailable: true,
  },
  {
    name: "Mohammed Ali",
    phone: "+919876543213",
    email: "mohammed.ali@zaplyt.com",
    specializations: ["Cleaning"],
    rating: 4.8,
    totalReviews: 256,
    completedJobs: 534,
    isVerified: true,
    isAvailable: true,
  },
];

export async function POST() {
  try {
    await dbConnect();

    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      Service.deleteMany({}),
      Provider.deleteMany({}),
      Booking.deleteMany({}),
    ]);

    // Create services
    const createdServices = await Service.insertMany(services);
    console.log(`Created ${createdServices.length} services`);

    // Create provider users and provider profiles
    const hashedPassword = await bcrypt.hash("provider123", 10);
    
    for (const provider of providers) {
      // Create user account for provider
      const providerUser = await User.create({
        phone: provider.phone,
        name: provider.name,
        email: provider.email,
        role: "provider",
        isVerified: true,
        password: hashedPassword,
      });

      // Get relevant service IDs
      const relevantServices = createdServices.filter(
        (s) => provider.specializations.includes(s.category)
      );

      // Create provider profile
      await Provider.create({
        userId: providerUser._id,
        name: provider.name,
        phone: provider.phone,
        email: provider.email,
        specializations: provider.specializations,
        services: relevantServices.map((s) => s._id),
        rating: provider.rating,
        totalReviews: provider.totalReviews,
        completedJobs: provider.completedJobs,
        isVerified: provider.isVerified,
        isAvailable: provider.isAvailable,
      });
    }

    console.log(`Created ${providers.length} providers`);

    // Create a demo user
    const demoUser = await User.create({
      phone: "+919999999999",
      name: "Demo User",
      email: "demo@zaplyt.com",
      role: "user",
      isVerified: true,
      addresses: [
        {
          type: "home",
          address: "123 Main Street, Sector 15",
          landmark: "Near City Mall",
          city: "Mumbai",
          pincode: "400001",
          isDefault: true,
        },
        {
          type: "work",
          address: "456 Business Park, Tower B",
          landmark: "Opposite Metro Station",
          city: "Mumbai",
          pincode: "400051",
          isDefault: false,
        },
      ],
    });

    console.log("Created demo user");

    return NextResponse.json({
      success: true,
      message: "Database seeded successfully",
      data: {
        services: createdServices.length,
        providers: providers.length,
        demoUser: {
          phone: demoUser.phone,
          name: demoUser.name,
        },
        providerCredentials: {
          phone: providers[0].phone,
          password: "provider123",
        },
      },
    });
  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json(
      { error: "Failed to seed database", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
