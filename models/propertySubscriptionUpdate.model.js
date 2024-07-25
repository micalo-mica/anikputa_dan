import mongoose from "mongoose";
const { Schema } = mongoose;

const propertySubscriptionUpdateSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    propertyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
      // required: true,
    },
    type: { type: String },
    state: { type: String },
    city: { type: String },
    category: { type: String },
    minPrice: { type: Number },
    maxPrice: { type: Number },
    updateFor: {
      type: String,
      enum: ["available", "market"],
      default: "available",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model(
  "PropertySubscriptionUpdate",
  propertySubscriptionUpdateSchema
);
