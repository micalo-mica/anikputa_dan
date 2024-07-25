import mongoose from "mongoose";

const connect = async () => {
  try {
    // await mongoose.connect(process.env.MONGO);
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to mongoDB.");
  } catch (error) {
    throw error;
  }
};

export default connect;
