import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Service from "@/models/Service";

export async function GET() {
  try {
    await connectToDatabase();

    // Get unique categories with their subcategories
    const services = await Service.find({ isActive: true }).select("category subcategory");

    const categoriesMap = new Map<string, Set<string>>();

    services.forEach((service) => {
      if (!categoriesMap.has(service.category)) {
        categoriesMap.set(service.category, new Set());
      }
      if (service.subcategory) {
        categoriesMap.get(service.category)!.add(service.subcategory);
      }
    });

    const categories = Array.from(categoriesMap.entries()).map(([name, subcategories]) => ({
      name,
      subcategories: Array.from(subcategories),
    }));

    return NextResponse.json({ categories });
  } catch (error) {
    console.error("Get categories error:", error);
    return NextResponse.json(
      { message: "Failed to get categories" },
      { status: 500 }
    );
  }
}
