import mongoose from "mongoose";
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    googleId: { type: String },
    accountType: {
      type: String,
      enum: ["client", "agent", "owner", "company"],
      default: "client",
      required: true,
    },
    name: { type: String, required: true },
    email: { type: String, required: true },
    picture: { type: String },
    dbPassword: { type: String },
    isVerified: { type: Boolean, default: false },
    // others
    address: { type: String },
    city: { type: String },
    state: { type: String },
    phoneNumber: { type: String },
    postalCode: { type: String },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("User", userSchema);
