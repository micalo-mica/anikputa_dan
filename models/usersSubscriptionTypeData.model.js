import mongoose from "mongoose";
const { Schema } = mongoose;

const usersSubscriptionTypeDataSchema = new Schema(
  {
    type: { type: String, required: true },
    duration: { type: Number, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    reference: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model(
  "UsersSubscriptionTypeData",
  usersSubscriptionTypeDataSchema
);
