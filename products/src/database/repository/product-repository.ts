import { CreateProductInput } from "../../dto/Product.dto";
import { APIError, STATUS_CODES } from "../../utils/app-errors";
import { Product } from "../models";

class ProductRepository {
  async createProduct({
    name,
    description,
    type,
    unit,
    price,
    isAvailable,
    supplier,
    banner,
  }: CreateProductInput) {
    try {
      const product = new Product({
        name,
        description,
        type,
        unit,
        price,
        isAvailable,
        supplier,
        banner,
      });

      const result = await product.save();
      return result;
    } catch (err) {
      throw new APIError(
        "API_ERROR",
        STATUS_CODES.INTERNAL_ERROR,
        "Unable to create product!"
      );
    }
  }

  async getAllProducts() {
    try {
      return await Product.find();
    } catch (err) {
      throw new APIError(
        "API_ERROR",
        STATUS_CODES.INTERNAL_ERROR,
        "Unable to get products!"
      );
    }
  }

  async findById(id: string) {
    try {
      return await Product.findById(id);
    } catch (err) {
      throw new APIError(
        "API_ERROR",
        STATUS_CODES.INTERNAL_ERROR,
        "Unable to find product!"
      );
    }
  }

  async findByCategory(category: string) {
    try {
      return await Product.find({ type: category });
    } catch (err) {
      throw new APIError(
        "API_ERROR",
        STATUS_CODES.INTERNAL_ERROR,
        "Unable to find product with this category!"
      );
    }
  }

  async findSelectedProducts(selectedIds: string[]) {
    try {
      const products = await Product.find()
        .where("_id")
        .in(selectedIds.map((_id) => _id))
        .exec();
      return products;
    } catch (err) {
      throw new APIError(
        "API_ERROR",
        STATUS_CODES.INTERNAL_ERROR,
        "Unable to find products!"
      );
    }
  }
}

export default ProductRepository;
