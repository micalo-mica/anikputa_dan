import mongoose from "mongoose";
const { Schema } = mongoose;

const subscriptionSchema = new Schema(
  {
    // name: { type: String, required: true },
    // userId: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    reference: { type: String, required: true },
    durationMonths: { type: Number, required: true }, // 1, 3, 6, 12
    price: { type: Number, required: true },
    name: {
      type: String,
      enum: ["user", "agent", "owner"],
      required: true,
    },
    type: { type: String },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Subscription", subscriptionSchema);
