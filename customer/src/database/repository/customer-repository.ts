import { Customer, Address } from "../models";
import { APIError, STATUS_CODES } from "../../utils/app-errors";
import {
  CreateCustomerInput,
  AddressInput,
  WishlistInput,
  CreateCartItemInput,
  CreateOrderInput,
} from "../../dto";

class CustomerRepository {
  async createCustomer({ email, password, phone, salt }: CreateCustomerInput) {
    try {
      const customer = new Customer({
        email,
        password,
        salt,
        phone,
        address: [],
      });
      const customerResult = await customer.save();
      return customerResult;
    } catch (err) {
      throw new APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        "Unable to Create Customer"
      );
    }
  }

  async createAddress({
    _id,
    street,
    postalCode,
    city,
    country,
  }: AddressInput) {
    try {
      const profile = await Customer.findById(_id);

      if (profile) {
        const newAddress = new Address({
          street,
          postalCode,
          city,
          country,
        });

        await newAddress.save();

        profile.address.push(newAddress);
      }

      return await profile!.save();
    } catch (err) {
      throw new APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        "Error on Create Address"
      );
    }
  }

  async findCustomer(email: string) {
    try {
      const existingCustomer = await Customer.findOne({ email });
      return existingCustomer;
    } catch (err) {
      throw new APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        "Unable to Find Customer"
      );
    }
  }

  async findCustomerById(id: string) {
    try {
      const existingCustomer = await Customer.findById(id).populate("address");
      return existingCustomer;
    } catch (err) {
      throw new APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        "Unable to Find Customer"
      );
    }
  }

  async wishlist(customerId: string) {
    try {
      const profile = await Customer.findById(customerId).populate("wishlist");

      return profile!.wishlist;
    } catch (err) {
      throw new APIError(
        "API ERROR",
        STATUS_CODES.INTERNAL_ERROR,
        "Unable to get wishlist"
      );
    }
  }

  async addWishlistItem(
    customerId: string,
    { _id, name, description, price, banner, isAvailable }: WishlistInput
  ) {
    const product = { _id, name, description, price, banner, isAvailable };
    try {
      const profile = await Customer.findById(customerId).populate("wishlist");

      if (profile) {
        let wishlist = profile.wishlist;

        if (wishlist.length > 0) {
          let isExist = false;

          wishlist.map((item) => {
            if (item._id.toString() === product._id.toString()) {
              const index = wishlist.indexOf(item);
              wishlist.splice(index, 1);
              isExist = true;
            }
          });

          if (!isExist) {
            wishlist.push(product);
          }
        } else {
          wishlist.push(product);
        }

        profile.wishlist = wishlist;
      }

      const result = await profile!.save();
      return result.wishlist;
    } catch (err) {
      throw new APIError(
        "API ERROR",
        STATUS_CODES.INTERNAL_ERROR,
        "Unable to add to wishlist"
      );
    }
  }

  async addCartItem(
    customerId: string,
    product: CreateCartItemInput,
    qty: number,
    isRemove: boolean
  ) {
    try {
      const profile = await Customer.findById(customerId);
      if (profile) {
        const cartItem = {
          product: {
            _id: product._id,
            name: product.name,
            price: product.price,
            banner: product.banner,
          },
          unit: qty,
        };

        let cartItems = profile.cart;
        if (cartItems.length > 0) {
          let isExist = false;
          cartItems.map((item) => {
            if (
              item.product._id.toString() === cartItem.product._id.toString()
            ) {
              if (isRemove) {
                cartItems.splice(cartItems.indexOf(item), 1);
              } else {
                item.unit = qty;
              }
              isExist = true;
            }
          });

          if (!isExist) {
            cartItems.push(cartItem);
          }
        } else {
          cartItems.push(cartItem);
        }

        profile.cart = cartItems;
        const result = await profile.save();
        return result;
      }

      throw new Error("Unable to add to cart!");
    } catch (err) {
      throw new APIError(
        "API ERROR",
        STATUS_CODES.INTERNAL_ERROR,
        "Unable to add to cart!"
      );
    }
  }

  async addOrder(customerId: string, order: CreateOrderInput) {
    try {
      const profile = await Customer.findById(customerId);

      if (profile) {
        if (profile.orders === undefined) {
          profile.orders = [];
        }

        profile.orders.push(order);
        profile.cart = [];
        const result = await profile.save();
        return result;
      }

      throw new Error("Unable to create order!");
    } catch (err) {
      throw new APIError(
        "API ERROR",
        STATUS_CODES.INTERNAL_ERROR,
        "Unable to create order!"
      );
    }
  }
}

export default CustomerRepository;
