import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import { createToken, setAuthCookie } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const { phone, otp } = await request.json();

    if (!phone || !otp) {
      return NextResponse.json(
        { message: "Phone and OTP are required" },
        { status: 400 }
      );
    }

    const dbConnection = await connectToDatabase();

    // Handle demo mode (when database is not available)
    if (!dbConnection) {
      // In demo mode, accept any 4-digit OTP or "1234"
      if (otp.length !== 4) {
        return NextResponse.json(
          { message: "Invalid OTP format" },
          { status: 400 }
        );
      }

      // Create a demo user
      const demoUser = {
        _id: `demo_${phone}`,
        name: "Demo User",
        phone: phone,
        role: "user" as const,
        email: null,
        avatar: null,
        addresses: [],
      };

      // Create JWT token for demo user
      const token = await createToken({
        userId: demoUser._id,
        role: demoUser.role,
      });

      // Set cookie
      await setAuthCookie(token);

      return NextResponse.json({
        message: "Login successful (Demo Mode)",
        user: demoUser,
      });
    }

    // Normal database mode
    const user = await User.findOne({ phone });

    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    // For demo purposes, accept "1234" as a valid OTP
    const isValidOtp = user.otp === otp || otp === "1234";
    const isExpired = user.otpExpiry && new Date() > user.otpExpiry;

    if (!isValidOtp) {
      return NextResponse.json(
        { message: "Invalid OTP" },
        { status: 400 }
      );
    }

    if (isExpired && otp !== "1234") {
      return NextResponse.json(
        { message: "OTP has expired" },
        { status: 400 }
      );
    }

    // Clear OTP
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    // Create JWT token
    const token = await createToken({
      userId: user._id.toString(),
      role: user.role,
    });

    // Set cookie
    await setAuthCookie(token);

    return NextResponse.json({
      message: "Login successful",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        avatar: user.avatar,
        addresses: user.addresses,
      },
    });
  } catch (error) {
    console.error("Verify OTP error:", error);
    return NextResponse.json(
      { message: "Verification failed" },
      { status: 500 }
    );
  }
}
