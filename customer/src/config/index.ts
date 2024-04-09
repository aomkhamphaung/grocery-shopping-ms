import { config } from "dotenv";

config();

export const APP_SECRET = process.env.APP_SECRET;
export const PORT = process.env.PORT || 5001;
export const DB_URI =
  process.env.MONGODB_URI ||
  "";
