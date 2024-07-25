import mongoose from "mongoose";
const { Schema } = mongoose;

const agentSchema = new Schema(
  {
    // userId: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    email: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    accountType: {
      type: String,
      enum: ["agent", "owner", "company"],
      default: "agent",
      required: true,
    },
    serviceType: {
      type: String,
      enum: ["agent", "orantage"],
      default: "agent",
      required: true,
    },
    address: String,
    city: String,
    state: String,
    postalCode: String,
    phoneNumber: String,
    licenseNumber: String,
    imageUrl: { type: String }, // verification ID image
    cloudinaryId: { type: String },
    // verification
    isVerified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true }, // Whether the agent account is active or not
    isApproved: { type: Boolean, default: false }, // Whether the agent account is

    // agent
    education: String,
    specialty: {
      type: String,
      enum: ["rent", "land", "building"],
      default: "rent",
    },
    experienceYears: Number,
    bio: String, // Biography or description of the agent

    // owner
    note: String, // Any additional notes or comments about the owner

    // company
    companyName: String,
    industry: {
      type: String,
      enum: ["Housing Company", "Real Estate", "Construction Company"],
      default: "Housing Company",
    },
    servicesOffered: String, // Array of services offered by the company (e.g., property management, real estate brokerage)
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Agent", agentSchema);
