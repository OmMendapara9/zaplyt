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
    const { reason } = await request.json();
    await connectToDatabase();

    const booking = await Booking.findOne({
      _id: id,
      userId: session.userId,
    });

    if (!booking) {
      return NextResponse.json({ message: "Booking not found" }, { status: 404 });
    }

    if (booking.status === "completed" || booking.status === "cancelled") {
      return NextResponse.json(
        { message: "Cannot cancel this booking" },
        { status: 400 }
      );
    }

    booking.status = "cancelled";
    booking.cancellationReason = reason;
    booking.cancelledBy = "user";
    
    // If payment was made, mark for refund
    if (booking.paymentStatus === "paid") {
      booking.paymentStatus = "refunded";
    }

    await booking.save();

    return NextResponse.json({ booking });
  } catch (error) {
    console.error("Cancel booking error:", error);
    return NextResponse.json({ message: "Failed to cancel booking" }, { status: 500 });
  }
}
