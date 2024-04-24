import { Application, Request, Response, NextFunction } from "express";
import CustomerService from "../services/customer-service";

export default async (app: Application) => {
  const service = new CustomerService();

  app.use(
    "/app-events",
    async (req: Request, res: Response, next: NextFunction) => {
      const { payload } = req.body;

      service.subscribeEvents(payload);

      console.log("===== Customer Service Received Event =====");
      return res.status(200).json(payload);
    }
  );
};
