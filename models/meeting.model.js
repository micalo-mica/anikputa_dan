import mongoose from "mongoose";
const { Schema } = mongoose;

const meetingSchema = new Schema(
  {
    // adminId: String,
    adminId: { type: Schema.Types.ObjectId, ref: "Admin" },
    firstName: String,
    lastName: String,
    email: String,
    phoneNumber: String,
    agenda: String,
    location: String,
    date: { type: Date, required: true },
    time: { type: String, required: true },
    typeOfMeeting: {
      type: String,
      enum: ["in-person", "online"],
      default: "online",
    },
    status: {
      type: String,
      enum: ["scheduled", "completed", "canceled"],
      default: "scheduled",
    },
    updaterId: String,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Meeting", meetingSchema);
