import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import { getSession } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    const user = await User.findById(session.userId).select("addresses");

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ addresses: user.addresses });
  } catch (error) {
    console.error("Get addresses error:", error);
    return NextResponse.json({ message: "Failed to get addresses" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const addressData = await request.json();
    await connectToDatabase();

    const user = await User.findById(session.userId);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const newAddress = {
      id: Math.random().toString(36).substring(7),
      label: addressData.label || "Home",
      address: addressData.address,
      landmark: addressData.landmark,
      city: addressData.city,
      pincode: addressData.pincode,
      isDefault: user.addresses.length === 0 ? true : addressData.isDefault || false,
    };

    // If new address is default, unset other defaults
    if (newAddress.isDefault) {
      user.addresses = user.addresses.map((addr) => ({
        ...addr,
        isDefault: false,
      }));
    }

    user.addresses.push(newAddress);
    await user.save();

    return NextResponse.json({ 
      address: newAddress,
      addresses: user.addresses 
    });
  } catch (error) {
    console.error("Add address error:", error);
    return NextResponse.json({ message: "Failed to add address" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id, ...updates } = await request.json();
    await connectToDatabase();

    const user = await User.findById(session.userId);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const addressIndex = user.addresses.findIndex((addr) => addr.id === id);
    if (addressIndex === -1) {
      return NextResponse.json({ message: "Address not found" }, { status: 404 });
    }

    // If setting as default, unset other defaults
    if (updates.isDefault) {
      user.addresses = user.addresses.map((addr) => ({
        ...addr,
        isDefault: false,
      }));
    }

    user.addresses[addressIndex] = {
      ...user.addresses[addressIndex],
      ...updates,
      id, // Preserve the ID
    };

    await user.save();

    return NextResponse.json({ addresses: user.addresses });
  } catch (error) {
    console.error("Update address error:", error);
    return NextResponse.json({ message: "Failed to update address" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ message: "Address ID required" }, { status: 400 });
    }

    await connectToDatabase();

    const user = await User.findById(session.userId);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    user.addresses = user.addresses.filter((addr) => addr.id !== id);
    await user.save();

    return NextResponse.json({ addresses: user.addresses });
  } catch (error) {
    console.error("Delete address error:", error);
    return NextResponse.json({ message: "Failed to delete address" }, { status: 500 });
  }
}
