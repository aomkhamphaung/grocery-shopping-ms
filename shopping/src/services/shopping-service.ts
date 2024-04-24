import ShoppingRepository from "../database/repository/shopping-repository";
import { CreateCartItemInput, userInput } from "../dto";
import { FormateData } from "../utils";
import { APIError, STATUS_CODES } from "../utils/app-errors";

class ShoppingService {
  private repository: ShoppingRepository;

  constructor() {
    this.repository = new ShoppingRepository();
  }

  async getCart(_id: string) {
    try {
      const cartItems = await this.repository.Cart(_id);

      return FormateData(cartItems);
    } catch (error: any) {
      throw new APIError(
        "Unable to get cart items",
        STATUS_CODES.INTERNAL_ERROR,
        error.message || "Unable to get cart items!"
      );
    }
  }

  async placeOrder(userInputs: userInput) {
    const { _id, transactionId } = userInputs;
    try {
      const orderResult = await this.repository.createNewOrder(
        _id,
        transactionId
      );
      return FormateData(orderResult);
    } catch (error: any) {
      throw new APIError(
        "Unable to place order!",
        STATUS_CODES.INTERNAL_ERROR,
        error.message || "Unable to place order!"
      );
    }
  }

  async getOrders(customerId: string) {
    try {
      const orders = await this.repository.Orders(customerId);
      return FormateData(orders);
    } catch (error: any) {
      throw new APIError(
        "Unable to get orders!",
        STATUS_CODES.INTERNAL_ERROR,
        error.message || "Unable to get orders!"
      );
    }
  }

  async manageCart(
    customerId: string,
    item: CreateCartItemInput,
    qty: number,
    isRemove: boolean
  ) {
    try {
      const cart = await this.repository.addCartItem(
        customerId,
        item,
        qty,
        isRemove
      );

      return FormateData(cart);
    } catch (error: any) {
      throw new APIError(
        "Unable to get data!",
        STATUS_CODES.INTERNAL_ERROR,
        error.message || "Unable to get orders!"
      );
    }
  }

  async subscribeEvents(payload: any) {
    const { event, data } = payload;
    const { userId, product, qty } = data;

    switch (event) {
      case "ADD_TO_CART":
        this.manageCart(userId, product, qty, false);
        break;
      case "REMOVE_FROM_CART":
        this.manageCart(userId, product, qty, true);
        break;
      default:
        break;
    }
  }

  async getOrderPayload(userId: string, order: {}, event: string) {
    if (order) {
      const payload = {
        event: event,
        data: { userId, order },
      };

      return FormateData(payload);
    } else {
      return FormateData({ error: "No order available!" });
    }
  }
}

export default ShoppingService;
