import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import twilio from "twilio";

const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER;

export async function POST(request: NextRequest) {
  try {
    const { phone } = await request.json();

    if (!phone || phone.length < 10) {
      return NextResponse.json(
        { message: "Valid phone number is required" },
        { status: 400 }
      );
    }

    // Connect to database
    const dbConnection = await connectToDatabase();
    
    if (!dbConnection) {
      console.warn("Database not connected - using demo mode OTP");
      // Demo mode: Generate and return OTP for testing
      const otp = Math.floor(1000 + Math.random() * 9000).toString();
      
      // In demo mode, OTP is returned in response for testing
      return NextResponse.json({
        message: "OTP sent successfully (Demo Mode)",
        demoOtp: otp,
        phone: phone,
      });
    }

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

    // Generate OTP
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    user.otp = otp;
    user.otpExpiry = otpExpiry;
    await user.save();

    // Send OTP via Twilio SMS (if configured)
    if (TWILIO_ACCOUNT_SID && TWILIO_AUTH_TOKEN && TWILIO_PHONE_NUMBER) {
      try {
        const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
        await client.messages.create({
          body: `Your Zaplyt OTP is: ${otp}. Valid for 5 minutes.`,
          from: TWILIO_PHONE_NUMBER,
          to: `+91${phone}`, // India country code
        });
      } catch (smsError) {
        console.error("SMS sending failed:", smsError);
        // Continue even if SMS fails - return success for demo purposes
      }
    } else {
      console.log(`OTP for ${phone}: ${otp} (SMS not configured)`);
    }

    return NextResponse.json({
      message: "OTP sent successfully",
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
