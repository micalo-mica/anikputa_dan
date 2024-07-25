import mongoose from "mongoose";
const { Schema } = mongoose;

const clientSchema = new Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    description: { type: String },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Client", clientSchema);
