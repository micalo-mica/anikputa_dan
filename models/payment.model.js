import mongoose from "mongoose";
const { Schema } = mongoose;

const paymentSchema = new Schema(
  {
    // userId: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    // subscriptionId: { type: String, required: true },
    subscriptionId: {
      type: Schema.Types.ObjectId,
      ref: "Subscription",
      required: true,
    },
    amount: { type: Number, required: true },
    payId: { type: String, required: false },
    reference: { type: String, required: true },
    currency: { type: String, required: false },
    status: { type: String, required: false },
    channel: { type: String, required: false },
    // paymentDate: { type: Date, default: Date.now },
    // paymentMethod: { type: String, required: true }, // e.g., 'credit card', 'paypal'
    // paymentStatus: {
    //   type: String,
    //   enum: ["Pending", "Completed", "Failed"],
    //   required: true,
    // },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Payment", paymentSchema);
