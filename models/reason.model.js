import mongoose from "mongoose";
const { Schema } = mongoose;

const reasonSchema = new Schema(
  {
    // userId: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    reason: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Reason", reasonSchema);
