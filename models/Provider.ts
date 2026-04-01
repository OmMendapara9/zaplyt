import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IProvider extends Document {
  _id: mongoose.Types.ObjectId;
  userId: Types.ObjectId;
  services: Types.ObjectId[];
  bio: string;
  experience: string;
  rating: number;
  totalBookings: number;
  completedBookings: number;
  earnings: number;
  isAvailable: boolean;
  isVerified: boolean;
  location: {
    city: string;
    areas: string[];
  };
  workingHours: {
    start: string;
    end: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const ProviderSchema = new Schema<IProvider>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    services: [{ type: Schema.Types.ObjectId, ref: "Service" }],
    bio: { type: String, default: "" },
    experience: { type: String, default: "1 year" },
    rating: { type: Number, default: 4.5, min: 0, max: 5 },
    totalBookings: { type: Number, default: 0 },
    completedBookings: { type: Number, default: 0 },
    earnings: { type: Number, default: 0 },
    isAvailable: { type: Boolean, default: true },
    isVerified: { type: Boolean, default: false },
    location: {
      city: { type: String, default: "Mumbai" },
      areas: { type: [String], default: [] },
    },
    workingHours: {
      start: { type: String, default: "09:00" },
      end: { type: String, default: "18:00" },
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
ProviderSchema.index({ userId: 1 });
ProviderSchema.index({ isAvailable: 1 });
ProviderSchema.index({ "location.city": 1 });

const Provider: Model<IProvider> =
  mongoose.models.Provider || mongoose.model<IProvider>("Provider", ProviderSchema);

export default Provider;
