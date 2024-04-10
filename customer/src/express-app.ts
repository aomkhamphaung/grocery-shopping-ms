import express, { Application } from "express";
import cors from "cors";
import ErrorHandler from "./utils/error-handler";
import router from "./api/customer";

export default async (app: Application) => {
  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ extended: true, limit: "1mb" }));
  app.use(cors());
  app.use(express.static(__dirname + "/public"));

  app.use("/", router);

  app.use(ErrorHandler);
};
