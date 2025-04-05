import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";

mongoose.set("strictQuery", false);

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    console.log("MongoDB already connected");
    return;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("[MongoDB] Connected successfully...");
  } catch (error) {
    console.error("[MongoDB] Connection error:", error);
    process.exit(1);
  }
};

export default connectDB;