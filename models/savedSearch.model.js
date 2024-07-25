import mongoose from "mongoose";
const { Schema } = mongoose;

const savedSearchSchema = new Schema(
  {
    // clientId: { type: String, required: true },
    clientId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    // propertyId: { type: String, required: true },
    propertyId: {
      type: Schema.Types.ObjectId,
      ref: "Property",
      required: true,
    },
    type: {
      type: String,
      enum: ["buy", "rent", "commercial", "plot"],
      required: true,
    },
    category: { type: String },
    price: { type: Number, required: true },
    bedrooms: { type: Number },
    bathrooms: { type: Number },
    coverImageUrl: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    // images: [
    //   {
    //     imageUrl: String,
    //     cloudinaryId: String,
    //   },
    // ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("SavedSearch", savedSearchSchema);
