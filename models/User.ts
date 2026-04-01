import mongoose, { Schema, Document, Model } from "mongoose";

export interface IAddress {
  id: string;
  label: "Home" | "Work" | "Other";
  address: string;
  landmark?: string;
  city: string;
  pincode: string;
  isDefault: boolean;
}

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  email?: string;
  phone: string;
  password?: string;
  role: "user" | "provider";
  avatar?: string;
  addresses: IAddress[];
  otp?: string;
  otpExpiry?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const AddressSchema = new Schema<IAddress>({
  id: { type: String, required: true },
  label: { type: String, enum: ["Home", "Work", "Other"], default: "Home" },
  address: { type: String, required: true },
  landmark: { type: String },
  city: { type: String, required: true },
  pincode: { type: String, required: true },
  isDefault: { type: Boolean, default: false },
});

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, sparse: true, index: true },
    phone: { type: String, required: true, unique: true, index: true },
    password: { type: String },
    role: { type: String, enum: ["user", "provider"], default: "user" },
    avatar: { type: String },
    addresses: { type: [AddressSchema], default: [] },
    otp: { type: String },
    otpExpiry: { type: Date },
  },
  {
    timestamps: true,
  }
);

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;
