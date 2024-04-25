import express, { Request, Response, NextFunction } from "express";
import ShoppingService from "../services/shopping-service";
import { UserAuth } from "./middlewares/auth";
import { PublishCustomerEvent } from "../utils";

const router = express.Router();
const service = new ShoppingService();

router.post(
  "/order",
  UserAuth,
  async (req: Request, res: Response, next: NextFunction) => {
    const { _id } = req.user;
    const { transactionId } = req.body;

    try {
      const { data } = await service.placeOrder({ _id, transactionId });

      const payload = await service.getOrderPayload(_id, data, "CREATE_ORDER");
      PublishCustomerEvent(payload);

      return res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  }
);

router.get(
  "/orders",
  UserAuth,
  async (req: Request, res: Response, next: NextFunction) => {
    const { _id } = req.user;
    try {
      const { data } = await service.getOrders(_id);
      return res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  }
);

router.get(
  "/cart",
  UserAuth,
  async (req: Request, res: Response, next: NextFunction) => {
    const { _id } = req.user;
    try {
      const { data } = await service.getCart(_id);
      return res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  }
);

export default router;
