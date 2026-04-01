import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(request: NextRequest) {
  try {
    const { phone } = await request.json();

    if (!phone || phone.length < 10) {
      return NextResponse.json(
        { message: "Valid phone number is required" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Find or create user
    let user = await User.findOne({ phone });
    
    if (!user) {
      // Create new user with phone number
      user = new User({
        name: "New User",
        phone,
        role: "user",
      });
    }

    // Generate OTP (in production, send via SMS)
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    user.otp = otp;
    user.otpExpiry = otpExpiry;
    await user.save();

    // In production, send OTP via SMS
    // For demo, we'll return it in response (remove in production!)
    console.log(`OTP for ${phone}: ${otp}`);

    return NextResponse.json({
      message: "OTP sent successfully",
      // Remove this in production - only for demo
      demoOtp: process.env.NODE_ENV === "development" ? otp : undefined,
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { message: "Failed to send OTP" },
      { status: 500 }
    );
  }
}
