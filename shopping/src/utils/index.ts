import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { APP_SECRET } from "../config";
import { Request } from "express";
// import { AuthPayload } from "../dto";
import axios from "axios";

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const GenerateSalt = async () => {
  return await bcrypt.genSalt();
};

export const GeneratePassword = async (password: string, salt: string) => {
  return await bcrypt.hash(password, salt);
};

export const ValidatePassword = async (
  enterPassword: string,
  savedPassword: string,
  salt: string
) => {
  return (await GeneratePassword(enterPassword, salt)) === savedPassword;
};

// export const GenerateToken = (payload: AuthPayload) => {
//   try {
//     return jwt.sign(payload, APP_SECRET, { expiresIn: "30d" });
//   } catch (error) {
//     console.log(error);
//     return error;
//   }
// };

export const ValidateToken = async (req: Request) => {
  try {
    const token = req.get("Authorization");
    const payload = await jwt.verify(token!.split(" ")[1], APP_SECRET);
    req.user = payload;
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const FormateData = (data: any) => {
  if (data) {
    return { data };
  } else {
    throw new Error("Data not found!");
  }
};

export const PublishCustomerEvent = async (payload: any) => {
  axios.post("http://localhost:5000/customer/app-events", { payload });
};
