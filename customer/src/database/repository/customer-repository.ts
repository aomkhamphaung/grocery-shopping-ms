import { Customer, Address } from "../models";
import { APIError, STATUS_CODES } from "../../utils/app-errors";
import { CustomerInput, AddressInput } from "../../dto";

class CustomerRepository {
  async createCustomer({ email, password, phone, salt }: CustomerInput) {
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

  async findCustomer({ email }: CustomerInput) {
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

  async findCustomerById({ _id }: CustomerInput) {
    try {
      const existingCustomer = await Customer.findById(_id).populate("address");

      return existingCustomer;
    } catch (err) {
      throw new APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        "Unable to Find Customer"
      );
    }
  }

  async wishlist({ _id }: CustomerInput) {
    try {
      const profile = await Customer.findById(_id).populate("wishlist");

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
    _id,
    { _id, name, description, price, isAvailable, banner }
  );
}

export default CustomerRepository;
