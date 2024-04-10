import express, { Request, Response, NextFunction } from "express";
import CustomerService from "../services/customer-service";
import { UserAuth } from "./middlewares/auth";

const router = express.Router();
const service = new CustomerService();

router.post(
  "/customer/signup",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password, phone } = req.body;
      const { data } = await service.signUp({ email, password, phone });
      return res.json(data);
    } catch (err) {
      next(err);
    }
  }
);

router.post(
  "/customer/login",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;
      const { data } = await service.signIn({ email, password });
      return res.json(data);
    } catch (err) {
      next(err);
    }
  }
);

router.post(
  "/customer/address",
  UserAuth,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { _id } = req.user;
      const { street, postalCode, city, country } = req.body;
      const { data } = await service.addNewAddress(_id, {
        street,
        postalCode,
        city,
        country,
      });
      return res.json(data);
    } catch (err) {
      next(err);
    }
  }
);

router.get(
  "/customer/profile",
  UserAuth,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { _id } = req.user;
      const { data } = await service.getProfile(_id);
      return res.json(data);
    } catch (err) {
      next(err);
    }
  }
);

// router.get(
//   "/customer/shoping-details",
//   UserAuth,
//   async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       const { _id } = req.user;
//       const { data } = await service.getShopingDetails(_id);
//       return res.json(data);
//     } catch (err) {
//       next(err);
//     }
//   }
// );

router.get(
  "/customer/wishlist",
  UserAuth,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { _id } = req.user;
      const { data } = await service.getWishlist(_id);
      return res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  }
);

export default router;
