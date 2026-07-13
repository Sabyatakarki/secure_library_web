import mongoose from "mongoose";
import { MONGO_URI } from "../config";

export async function connectDatabase() {
  try {
    await mongoose.connect(MONGO_URI);

    console.log("MongoDB Connected Successfully");
  } catch (error) {
    console.error("Database Connection Error:", error);
    process.exit(1);
  }
}