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
    const { scheduledDate, scheduledTime } = await request.json();
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
        { message: "Cannot reschedule this booking" },
        { status: 400 }
      );
    }

    booking.scheduledDate = new Date(scheduledDate);
    booking.scheduledTime = scheduledTime;
    booking.status = "pending"; // Reset to pending for provider to accept new time

    await booking.save();

    return NextResponse.json({ booking });
  } catch (error) {
    console.error("Reschedule booking error:", error);
    return NextResponse.json({ message: "Failed to reschedule booking" }, { status: 500 });
  }
}
