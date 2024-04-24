import { CreateCartItemInput } from "../../dto";
import { APIError, STATUS_CODES } from "../../utils/app-errors";
import { Cart, Order } from "../models";
import { v4 as uuidv4 } from "uuid";

class ShoppingRepository {
  async Orders(customerId: string) {
    try {
      const orders = await Order.findById({ customerId });
      return orders;
    } catch (err) {
      throw new APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        "Unable to find orders"
      );
    }
  }

  async Cart(customerId: string) {
    try {
      const cartItems = await Cart.find({ customerId: customerId });
      if (cartItems) {
        return cartItems;
      }
    } catch (err) {
      throw new APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        "Data not found!"
      );
    }
  }

  async addCartItem(
    customerId: string,
    item: CreateCartItemInput,
    qty: number,
    isRemove: boolean
  ) {
    try {
      const cart = await Cart.findOne({ customerId: customerId });

      const { _id } = item;

      if (cart) {
        let isExist = false;
        let cartItems = cart?.items;

        if (cartItems.length > 0) {
          cartItems.map((item) => {
            if (item.product._id.toString() === _id.toString()) {
              if (isRemove) {
                cartItems.splice(cartItems.indexOf(item), 1);
              } else {
                item.unit = qty;
              }
              isExist = true;
            }
          });
        }

        if (!isExist && !isRemove) {
          cartItems.push({ product: { ...item }, unit: qty });
        }

        cart.items = cartItems;
        return await cart.save();
      } else {
        return await Cart.create({
          customerId,
          items: [{ product: { ...item }, unit: qty }],
        });
      }
    } catch (err) {
      throw new APIError(
        "API ERROR",
        STATUS_CODES.INTERNAL_ERROR,
        "Unable to add to cart!"
      );
    }
  }

  async createNewOrder(customerId: string, transactionId: string) {
    try {
      const cart = await Cart.findOne({ customerId: customerId });

      if (cart) {
        let amount: number = 0;
        let cartItems = cart.items;

        if (cartItems.length > 0) {
          cartItems.map((item) => {
            amount += item.product.price * item.unit;
          });

          const orderId = uuidv4();

          const order = new Order({
            orderId,
            customerId,
            amount,
            transactionId,
            status: "received",
            items: cartItems,
          });

          cart.items = [];

          const result = await order.save();
          await cart.save();
          return result;
        }
      }
    } catch (err) {
      throw new APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        "Unable to create order!"
      );
    }
  }
}
