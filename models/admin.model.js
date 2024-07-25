import mongoose from "mongoose";
const { Schema } = mongoose;

const adminSchema = new Schema(
  {
    employeeId: { type: String, required: true }, // Employee ID or unique identifier for the admin
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: String,
    password: String,
    address: String,
    lga: String,
    city: String,
    state: String,
    postalCode: String,
    phoneNumber: String,
    roles: {
      type: [String],
      default: ["105"],
    },
    isActivated: { type: Boolean, default: false, required: true },
    permissions: [String], // Array of permissions granted to the admin user
    isActive: { type: Boolean, default: true, required: true }, // Whether the admin account is active or not
    isApproved: { type: Boolean, default: false, required: true }, // Whether the admin account is isApproved or not
    education: String, // Last login timestamp for admin
    department: String, // Department or area of responsibility within the company (e.g., sales, marketing, operations)
    notes: String, // Additional notes or comments about the admin
    relationship: String,
    gender: String,
    nextOfKinName: String,
    nextOfKinNumber: String,

    imageUrl: { type: String },
    cloudinaryId: { type: String },
    tasks: [String], // Array of current tasks or responsibilities assigned to the admin

    restPasswordToken: String, // for resetting of password
  },
  { timestamps: true }
);

export default mongoose.model("Admin", adminSchema);
