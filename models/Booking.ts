import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IBookingService {
  serviceId: string | Types.ObjectId;
  name: string;
  price: number;
  quantity: number;
}

export interface IBooking extends Document {
  _id: mongoose.Types.ObjectId;
  userId: Types.ObjectId;
  providerId?: Types.ObjectId;
  services: IBookingService[];
  address: {
    label: string;
    address: string;
    landmark?: string;
    city: string;
    pincode: string;
  };
  scheduledDate: Date;
  scheduledTime: string;
  status: "pending" | "accepted" | "in-progress" | "completed" | "cancelled";
  totalAmount: number;
  discount?: number;
  finalAmount: number;
  paymentMethod: "cash" | "upi" | "card" | "wallet";
  paymentStatus: "pending" | "paid" | "refunded";
  cancellationReason?: string;
  cancelledBy?: "user" | "provider";
  rating?: number;
  feedback?: string;
  providerNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const BookingServiceSchema = new Schema<IBookingService>({
  serviceId: { type: Schema.Types.Mixed, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
});

const BookingSchema = new Schema<IBooking>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    providerId: { type: Schema.Types.ObjectId, ref: "Provider" },
    services: { type: [BookingServiceSchema], required: true },
    address: {
      label: { type: String, required: true },
      address: { type: String, required: true },
      landmark: { type: String },
      city: { type: String, required: true },
      pincode: { type: String, required: true },
    },
    scheduledDate: { type: Date, required: true },
    scheduledTime: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "accepted", "in-progress", "completed", "cancelled"],
      default: "pending",
    },
    totalAmount: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    finalAmount: { type: Number, required: true },
    paymentMethod: {
      type: String,
      enum: ["cash", "upi", "card", "wallet"],
      default: "cash",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "refunded"],
      default: "pending",
    },
    cancellationReason: { type: String },
    cancelledBy: { type: String, enum: ["user", "provider"] },
    rating: { type: Number, min: 1, max: 5 },
    feedback: { type: String },
    providerNotes: { type: String },
  },
  {
    timestamps: true,
  }
);

// Indexes
BookingSchema.index({ userId: 1, createdAt: -1 });
BookingSchema.index({ providerId: 1, status: 1 });
BookingSchema.index({ status: 1 });
BookingSchema.index({ scheduledDate: 1 });

const Booking: Model<IBooking> =
  mongoose.models.Booking || mongoose.model<IBooking>("Booking", BookingSchema);

export default Booking;
