import express, { Application } from "express";
import cors from "cors";
import ErrorHandler from "./utils/error-handler";
import router from "./api/customer";
import appEvents from "./api/app-events";

export default async (app: Application) => {
  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ extended: true, limit: "1mb" }));
  app.use(cors());
  app.use(express.static(__dirname + "/public"));

  appEvents(app);

  app.use("/", router);

  app.use(ErrorHandler);
};
