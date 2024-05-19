import express, { Application } from "express";
import cors from "cors";
import appEvents from "./api/app-events";
import router from "./api/product";
import { Channel } from "amqplib";

export default async (app: Application, channel: Channel) => {
  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ extended: true, limit: "1mb" }));
  app.use(cors());
  app.use(express.static(__dirname + "/public"));

  appEvents(app);

  app.use("/", router);
};
