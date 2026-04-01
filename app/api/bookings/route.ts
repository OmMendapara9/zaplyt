import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Booking from "@/models/Booking";
import { getSession } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const type = searchParams.get("type"); // 'upcoming' or 'previous'

    await connectToDatabase();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const query: any = { userId: session.userId };

    if (status) {
      query.status = status;
    }

    if (type === "upcoming") {
      query.status = { $in: ["pending", "accepted", "in-progress"] };
    } else if (type === "previous") {
      query.status = { $in: ["completed", "cancelled"] };
    }

    const bookings = await Booking.find(query)
      .sort({ scheduledDate: type === "upcoming" ? 1 : -1, createdAt: -1 })
      .lean();

    return NextResponse.json({ bookings });
  } catch (error) {
    console.error("Get bookings error:", error);
    return NextResponse.json({ message: "Failed to get bookings" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const bookingData = await request.json();
    await connectToDatabase();

    const servicesWithObjectIds = bookingData.services.map((service: any) => ({
      ...service,
      serviceId: service.serviceId,
    }));

    const booking = new Booking({
      userId: session.userId,
      services: servicesWithObjectIds,
      address: bookingData.address,
      scheduledDate: new Date(bookingData.scheduledDate),
      scheduledTime: bookingData.scheduledTime,
      totalAmount: bookingData.totalAmount,
      discount: bookingData.discount || 0,
      finalAmount: bookingData.finalAmount,
      paymentMethod: bookingData.paymentMethod,
      status: "pending",
      paymentStatus: bookingData.paymentMethod === "cash" ? "pending" : "paid",
    });

    await booking.save();

    return NextResponse.json({ booking }, { status: 201 });
  } catch (error) {
    console.error("Create booking error:", error);
    return NextResponse.json({ message: "Failed to create booking" }, { status: 500 });
  }
}
