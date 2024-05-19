import { config } from "dotenv";

config();

export const APP_SECRET = process.env.APP_SECRET || "";
export const PORT = process.env.PORT || 5002;
export const DB_URI =
  process.env.MONGODB_URI ||
  "";
export const MESSAGE_BROKER_URL = process.env.MESSAGE_BROKER_URL;
export const EXCHANGE_NAME = "ONLINE_SHOPPING";
export const SHOPPING_BINDING_KEY = "SHOPPING_SERVICE";
export const CUSTOMER_BINDING_KEY = "CUSTOMER_SERVICE";
