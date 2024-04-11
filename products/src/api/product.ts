import express, { Request, Response, NextFunction } from "express";
import ProductService from "../services/product-service";
import { UserAuth } from "./middleware/auth";
import { PublishCustomerEvent, PublishShoppingEvent } from "../utils";

const router = express.Router();
const service = new ProductService();

router.post(
  "/product/create",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {
        name,
        description,
        type,
        unit,
        price,
        isAvailable,
        supplier,
        banner,
      } = req.body;
      const { data } = await service.createProduct({
        name,
        description,
        type,
        unit,
        price,
        isAvailable,
        supplier,
        banner,
      });
      return res.json(data);
    } catch (err) {
      next(err);
    }
  }
);

router.get(
  "/category/:type",
  async (req: Request, res: Response, next: NextFunction) => {
    const type = req.params.type;

    try {
      const { data } = await service.getProductByCategory(type);
      return res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  }
);

router.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
  const productId = req.params.id;

  try {
    const { data } = await service.getProductDescription(productId);
    return res.status(200).json(data);
  } catch (err) {
    next(err);
  }
});

router.post("/ids", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { ids } = req.body;
    const products = await service.getSelectedProducts(ids);
    return res.status(200).json(products);
  } catch (err) {
    next(err);
  }
});

router.put(
  "/wishlist",
  UserAuth,
  async (req: Request, res: Response, next: NextFunction) => {
    const { _id } = req.user;

    try {
      const { data } = await service.getProductPayload(
        _id,
        {
          productId: req.body._id,
          qty: req.body,
        },
        "ADD_TO_WISHLIST"
      );

      PublishCustomerEvent(data);
      return res.status(200).json(data.data.product);
    } catch (err) {}
  }
);

router.delete(
  "/wishlist/:id",
  UserAuth,
  async (req: Request, res: Response, next: NextFunction) => {
    const { _id } = req.user;
    const productId = req.params.id;

    try {
      const { data } = await service.getProductPayload(
        _id,
        {
          productId,
          qty: req.body,
        },
        "REMOVE_FROM_WISHLIST"
      );

      PublishCustomerEvent(data);

      return res.status(200).json(data.data.product);
    } catch (err) {
      next(err);
    }
  }
);

router.put(
  "/cart",
  UserAuth,
  async (req: Request, res: Response, next: NextFunction) => {
    const { _id } = req.user;

    try {
      const { data } = await service.getProductPayload(
        _id,
        {
          productId: req.body,
          qty: req.body,
        },
        "ADD_TO_CART"
      );

      PublishCustomerEvent(data);
      PublishShoppingEvent(data);

      const result = {
        product: data.data.product,
        unit: data.data.qty,
      };

      return res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  }
);

router.delete(
  "/cart/:id",
  UserAuth,
  async (req: Request, res: Response, next: NextFunction) => {
    const { _id } = req.user;

    try {
      const { data } = await service.getProductPayload(
        _id,
        {
          productId: req.body,
          qty: req.body,
        },
        "REMOVE_FROM_CART"
      );

      PublishCustomerEvent(data);
      PublishShoppingEvent(data);

      const result = {
        product: data.data.product,
        unit: data.data.qty,
      };

      return res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  }
);

//get Top products and category
router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  //check validation
  try {
    const { data } = await service.getAllProducts();
    return res.status(200).json(data);
  } catch (err: any) {
    next(err);
  }
});

export default router;
