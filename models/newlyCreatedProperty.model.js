import mongoose from "mongoose";
const { Schema } = mongoose;

const newlyCreatedPropertySchema = new Schema(
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
  "NewlyCreatedProperty",
  newlyCreatedPropertySchema
);
