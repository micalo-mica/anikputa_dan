import mongoose from "mongoose";
const { Schema } = mongoose;

const propertySchema = new Schema(
  {
    // creatorId: { type: String, required: true },
    creatorId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    // agentId: { type: String, required: true },
    agentId: { type: Schema.Types.ObjectId, ref: "Agent", required: true },
    visualId: { type: String, required: true },
    name: { type: String, required: true },
    type: {
      type: String,
      enum: ["buy", "rent", "commercial", "plot"],
      required: true,
    },
    category: { type: String, enum: ["flat", "selfCon"] },
    price: { type: Number, required: true },
    bedrooms: { type: Number },
    bathrooms: { type: Number },
    address: { type: String, required: true },
    city: { type: String, required: true },
    lga: { type: String },
    state: { type: String, required: true },
    postalCode: String,
    features: { type: [String], default: [] },
    floors: { type: [String], default: [] },
    nearbyAmenities: { type: [String], default: [] },
    highLight: { type: String, required: true },
    description: { type: String, required: true },
    isAvailable: { type: Boolean, required: true, default: true },
    isApproved: { type: Boolean, required: true, default: true },
    isOrantage: { type: Boolean, required: true, default: false },
    isRentOwnerWantOrantageService: {
      type: Boolean,
      required: true,
      default: false,
    },
    isSold: { type: Boolean, required: true, default: false },

    coverImageUrl: { type: String, required: true },
    coverImageCloudinaryId: { type: String, required: true },
    images: [
      {
        imageUrl: String,
        cloudinaryId: String,
      },
    ],
    lat: { type: Number, default: 6.4402, required: true },
    long: { type: Number, default: 7.4988, required: true },
    completed: { type: Boolean, default: true },
    // Additional Fields based on type for rent and commercial
    firstPayment: { type: Number },

    // buy
    buy: {
      yearBuilt: { type: Number },
    },

    // plot
    plot: {
      NoOfPlots: { type: Number, default: 1 },
      zoning: {
        type: String,
        enum: ["Residential", "Commercial", "Agricultural"],
        default: "Residential",
      },
      terrain: {
        type: String,
        enum: ["Flat", "Sloppy"],
        default: "Flat",
      },
      isAccessible: { type: Boolean, default: true },
      roadAccess: { type: Boolean, default: true },
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Property", propertySchema);
