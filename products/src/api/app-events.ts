import { Application, Request, Response, NextFunction } from "express";
import ProductService from "../services/product-service";

export default async (app: Application) => {
  // const service = new ProductService();

  app.use(
    "/app-events",
    async (req: Request, res: Response, next: NextFunction) => {
      const { payload } = req.body;

      console.log("===== Product Service Received Event =====");
      return res.status(200).json(payload);
    }
  );
};
