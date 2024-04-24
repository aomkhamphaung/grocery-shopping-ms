import { Application, Request, Response, NextFunction } from "express";
import ShoppingService from "../services/shopping-service";

export default async (app: Application) => {
  const service = new ShoppingService();

  app.use(
    "/app-events",
    async (req: Request, res: Response, next: NextFunction) => {
      const { payload } = req.body;

      service.subscribeEvents(payload);

      console.log("===== Shopping Service Received Event =====");
      return res.status(200).json(payload);
    }
  );
};
