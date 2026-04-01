import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Booking from "@/models/Booking";
import { getSession } from "@/lib/auth";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const { rating, feedback } = await request.json();
    await connectToDatabase();

    const booking = await Booking.findOne({
      _id: id,
      userId: session.userId,
    });

    if (!booking) {
      return NextResponse.json({ message: "Booking not found" }, { status: 404 });
    }

    if (booking.status !== "completed") {
      return NextResponse.json(
        { message: "Can only rate completed bookings" },
        { status: 400 }
      );
    }

    booking.rating = rating;
    booking.feedback = feedback;

    await booking.save();

    return NextResponse.json({ booking });
  } catch (error) {
    console.error("Add feedback error:", error);
    return NextResponse.json({ message: "Failed to add feedback" }, { status: 500 });
  }
}
