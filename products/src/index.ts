import express from "express";
import App from "./express-app";
import { PORT } from "./config";
import { dbConnection } from "./database";

const server = async () => {
  const app = express();

  await dbConnection();

  await App(app);

  app.listen(PORT, () => {
    console.log(`🚀 Product Server is up on port: ${PORT}`);
  });
};

server();
