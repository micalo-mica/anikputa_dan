import mongoose from "mongoose";
const { Schema } = mongoose;

const userSubscriptionSchema = new Schema(
  {
    // userId: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    // subscriptionId: { type: String, required: true },
    subscriptionId: {
      type: Schema.Types.ObjectId,
      ref: "Subscription",
      required: true,
    },
    paymentId: {
      type: Schema.Types.ObjectId,
      ref: "Payment",
      required: true,
    },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("UserSubscription", userSubscriptionSchema);
