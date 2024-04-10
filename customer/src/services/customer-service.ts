import CustomerRepository from "../database/repository/customer-repository";
import {
  FormateData,
  GeneratePassword,
  GenerateSalt,
  GenerateToken,
  ValidatePassword,
} from "../utils";
import { APIError, STATUS_CODES } from "../utils/app-errors";

class CustomerService {
  private repository: CustomerRepository;

  constructor() {
    this.repository = new CustomerRepository();
  }

  async signIn(userInputs: { email: string; password: string }) {
    const { email, password } = userInputs;

    try {
      const existingCustomer = await this.repository.findCustomer({
        email,
      });

      if (!existingCustomer) {
        throw new APIError(
          "Customer not found",
          STATUS_CODES.NOT_FOUND,
          "Customer not found"
        );
      }

      const validPassword = await ValidatePassword(
        password,
        existingCustomer.password,
        existingCustomer.salt
      );

      if (!validPassword) {
        throw new APIError(
          "Invalid password",
          STATUS_CODES.UNAUTHORIZED,
          "Invalid password"
        );
      }

      const token = await GenerateToken({
        email: existingCustomer.email,
        _id: existingCustomer._id,
      });
      return FormateData({ id: existingCustomer._id, token });
    } catch (error: any) {
      throw new APIError(
        "Sign-in failed",
        STATUS_CODES.INTERNAL_ERROR,
        error.message || "Sign-in failed"
      );
    }
  }

  async signUp(userInputs: { email: string; password: string; phone: string }) {
    const { email, password, phone } = userInputs;

    try {
      const existingCustomer = await this.repository.findCustomer({ email });

      if (existingCustomer) {
        throw new APIError(
          "Email already exists",
          STATUS_CODES.CONFLICT,
          "Email already exists"
        );
      }

      let salt = await GenerateSalt();
      let userPassword = await GeneratePassword(password, salt);

      const createdCustomer = await this.repository.createCustomer({
        email,
        password: userPassword,
        phone,
        salt,
      });

      const token = await GenerateToken({ email, _id: createdCustomer._id });
      return FormateData({ id: createdCustomer._id, token });
    } catch (error: any) {
      throw new APIError(
        "Sign-up failed",
        STATUS_CODES.INTERNAL_ERROR,
        error.message || "Sign-up failed"
      );
    }
  }

  async addNewAddress(
    _id: string,
    userInputs: {
      street: string;
      postalCode: string;
      city: string;
      country: string;
    }
  ) {
    const { street, postalCode, city, country } = userInputs;

    try {
      const addressResult = await this.repository.createAddress({
        _id,
        street,
        postalCode,
        city,
        country,
      });
      return FormateData(addressResult);
    } catch (error: any) {
      throw new APIError(
        "Add address failed",
        STATUS_CODES.INTERNAL_ERROR,
        error.message || "Add address failed"
      );
    }
  }

  async getProfile(_id: string) {
    try {
      const existingCustomer = await this.repository.findCustomerById(_id);
      return FormateData(existingCustomer);
    } catch (err: any) {
      throw new APIError("Data Not found", err);
    }
  }

  async getWishlist(customerId: string) {
    try {
      const wishListItems = await this.repository.wishlist(customerId);
      return FormateData(wishListItems);
    } catch (err: any) {
      throw new APIError("Data Not found", err);
    }
  }

  async addToWishlist(
    customerId: string,
    product: {
      _id: string;
      name: string;
      description: string;
      price: number;
      banner: string;
      isAvailable: boolean;
    }
  ) {
    try {
      const wishlistResult = await this.repository.addWishlistItem(
        customerId,
        product
      );
      return FormateData(wishlistResult);
    } catch (err: any) {
      throw new APIError("Data Not found", err);
    }
  }
}

export default CustomerService;
