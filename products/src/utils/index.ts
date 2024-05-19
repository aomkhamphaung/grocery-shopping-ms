import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { APP_SECRET, MESSAGE_BROKER_URL, EXCHANGE_NAME } from "../config";
import { Request } from "express";
import { AuthPayload } from "../dto/Auth.dto";
import amqplib  from "amqplib";

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

export const GenerateToken = (payload: AuthPayload) => {
  try {
    return jwt.sign(payload, APP_SECRET, { expiresIn: "30d" });
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const ValidateToken = async (req: Request) => {
  try {
    const token = req.get("Authorization");
    const bearerToken = token!.split(" ")[1];
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

/* ==================== Message Broker ==================== */

// Create a channel
export const CreateChannel = async () => {
  try {
    const connection = await amqplib.connect(MESSAGE_BROKER_URL);
    const channel = await connection.createChannel();
    await channel.assertExchange(EXCHANGE_NAME, "direct", false);
    return channel;
  } catch(err) {
    throw err;
  }
  
}

// publish message
export const PublishMessage = async (channel: string, service: string, message: string) => {
  try {
    await channel.publish(EXCHAGE_NAME, binding_key, Buffer.from(message));
  } catch(err) {
    throw err;
  }
}

// subscribe message
export const SubscribeMessage = async (channel: string, service: string, binding_key: string) => {
  const appQueue = await channel.assertQueue(QUEUE_NAME);
  channel.bindQueue(appQueue.queue, EXCHANGE_NAME, binding_key);
  channel.consume(appQueue.queue, data => {
    console.log("received data");
    console.log(data.content.toString());
    channel.ack(data);
  })
}