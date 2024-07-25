import mongoose from "mongoose";
const { Schema } = mongoose;

const weeklyCreatedPropertySchema = new Schema(
  {
    propertyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model(
  "WeeklyCreatedProperty",
  weeklyCreatedPropertySchema
);
