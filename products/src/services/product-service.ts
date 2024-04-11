import ProductRepository from "../database/repository/product-repository";
import { ProductPayload, CreateProductInput } from "../dto/Product.dto";
import { FormateData } from "../utils";
import { APIError } from "../utils/app-errors";

class ProductService {
  private repository: ProductRepository;

  constructor() {
    this.repository = new ProductRepository();
  }

  async createProduct(productInputs: CreateProductInput) {
    try {
      const product = await this.repository.createProduct(productInputs);
      return FormateData(product);
    } catch (err: any) {
      throw new APIError("Cannot create product!", err);
    }
  }

  async getAllProducts() {
    try {
      const products = await this.repository.getAllProducts();
      let categories: any = {};

      products.map(({ type }) => {
        categories[type] = type;
      });

      return FormateData({ products, Categories: Object.keys(categories) });
    } catch (err: any) {
      throw new APIError("Unable to get products", err);
    }
  }

  async getProductDescription(productId: string) {
    try {
      const product = await this.repository.findById(productId);
      return FormateData(product);
    } catch (err: any) {
      throw new APIError("Product not found!", err);
    }
  }

  async getProductByCategory(category: string) {
    try {
      const product = await this.repository.findByCategory(category);
      return FormateData(product);
    } catch (err: any) {
      throw new APIError("Category not found!", err);
    }
  }

  async getSelectedProducts(selectedIds: string[]) {
    try {
      const products = await this.repository.findSelectedProducts(selectedIds);
      return FormateData(products);
    } catch (err: any) {
      throw new APIError("Unable to get products!", err);
    }
  }

  async getProductById(id: string) {
    try {
      const product = await this.repository.findById(id);
      return FormateData(product);
    } catch (err: any) {
      throw new APIError("Unable to get product!", err);
    }
  }

  async getProductPayload(
    userId: string,
    { productId, qty }: ProductPayload,
    event: string
  ) {
    const product = await this.repository.findById(productId);
    if (product) {
      const payload = {
        event: event,
        data: { userId, product, qty },
      };

      return FormateData(payload);
    } else {
      return FormateData({ error: "No product available!" });
    }
  }
}

export default ProductService;
