import mongoose from "mongoose";
import { DB_URI } from "../config";

export const dbConnection = async () => {
  try {
    await mongoose.connect(DB_URI);
    console.log(`Connected to MongoDB...`);
  } catch (err) {
    console.log(err);
  }
};
