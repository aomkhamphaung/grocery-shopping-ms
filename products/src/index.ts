import express from "express";
import App from "./express-app";
import { PORT } from "./config";
import { dbConnection } from "./database";
import { CreateChannel } from "./utils";

const server = async () => {
  const app = express();

  await dbConnection();

  const channel = await CreateChannel();

  await App(app, channel);

  app.listen(PORT, () => {
    console.log(`🚀 Product Server is up on port: ${PORT}`);
  });
};

server();
