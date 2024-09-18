import mongoose, { ConnectOptions } from "mongoose";
import dotenv from "dotenv";
// Load environment variables
dotenv.config();

// MongoDB connection using Mongoose
export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI!, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as ConnectOptions);
    console.log("✅ MongoDB connected successfully");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1); // Exit on failure
  }
};
