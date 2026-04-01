import mongoose, { Schema, Document, Model } from "mongoose";

export interface IService extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  category: string;
  subcategory?: string;
  description: string;
  price: number;
  originalPrice?: number;
  duration: string;
  image: string;
  includes: string[];
  rating: number;
  reviewCount: number;
  isPopular: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ServiceSchema = new Schema<IService>(
  {
    name: { type: String, required: true },
    category: { type: String, required: true },
    subcategory: { type: String },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    originalPrice: { type: Number },
    duration: { type: String, required: true },
    image: { type: String, required: true },
    includes: { type: [String], default: [] },
    rating: { type: Number, default: 4.5, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0 },
    isPopular: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

// Indexes
ServiceSchema.index({ category: 1 });
ServiceSchema.index({ subcategory: 1 });
ServiceSchema.index({ isPopular: 1 });
ServiceSchema.index({ name: "text", description: "text" });

const Service: Model<IService> =
  mongoose.models.Service || mongoose.model<IService>("Service", ServiceSchema);

export default Service;
