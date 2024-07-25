import mongoose from "mongoose";
const { Schema } = mongoose;

const soldSchema = new Schema(
  {
    // propertyId: { type: String, required: true },
    propertyId: {
      type: Schema.Types.ObjectId,
      ref: "Property",
      required: true,
    },
    sellerId: { type: Schema.Types.ObjectId, ref: "Agent" },
    // sellerId: String,
    sellerType: {
      type: String,
      enum: ["orantage", "agent"],
      required: true,
    },
    name: { type: String },
    type: { type: String },
    address: { type: String },
    city: { type: String },
    lga: { type: String },
    state: { type: String },
    price: { type: Number },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Sold", soldSchema);
