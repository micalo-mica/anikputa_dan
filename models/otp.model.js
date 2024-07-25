import mongoose from "mongoose";
const { Schema } = mongoose;

const otpSchema = new Schema(
  {
    email: { type: String, required: true },
    otp: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Otp", otpSchema);
