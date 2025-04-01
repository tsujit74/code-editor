import mongoose from "mongoose";

mongoose.set("strictQuery", false);
console.log("mongodb uri", process.env.MONGODB_URI);



const connectDB = async () => {
  const uri = "mongodb://127.0.0.1:27017/codeeditor";

  if (mongoose.connection.readyState === 1) {
    console.log("MongoDB already connected");
    return;
  }

  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("[MongoDB] Connected successfully...");
  } catch (error) {
    console.error("[MongoDB] Connection error:", error);
  }
};

export default connectDB;

