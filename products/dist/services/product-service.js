"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const product_repository_1 = __importDefault(require("../database/repository/product-repository"));
const utils_1 = require("../utils");
const app_errors_1 = require("../utils/app-errors");
class ProductService {
    constructor() {
        this.repository = new product_repository_1.default();
    }
    createProduct(productInputs) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const product = yield this.repository.createProduct(productInputs);
                return (0, utils_1.FormateData)(product);
            }
            catch (err) {
                throw new app_errors_1.APIError("Cannot create product!", err);
            }
        });
    }
    getAllProducts() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const products = yield this.repository.getAllProducts();
                let categories = {};
                products.map(({ type }) => {
                    categories[type] = type;
                });
                return (0, utils_1.FormateData)({ products, Categories: Object.keys(categories) });
            }
            catch (err) {
                throw new app_errors_1.APIError("Unable to get products", err);
            }
        });
    }
    getProductDescription(productId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const product = yield this.repository.findById(productId);
                return (0, utils_1.FormateData)(product);
            }
            catch (err) {
                throw new app_errors_1.APIError("Product not found!", err);
            }
        });
    }
    getProductByCategory(category) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const product = yield this.repository.findByCategory(category);
                return (0, utils_1.FormateData)(product);
            }
            catch (err) {
                throw new app_errors_1.APIError("Category not found!", err);
            }
        });
    }
    getSelectedProducts(selectedIds) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const products = yield this.repository.findSelectedProducts(selectedIds);
                return (0, utils_1.FormateData)(products);
            }
            catch (err) {
                throw new app_errors_1.APIError("Unable to get products!", err);
            }
        });
    }
    getProductById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const product = yield this.repository.findById(id);
                return (0, utils_1.FormateData)(product);
            }
            catch (err) {
                throw new app_errors_1.APIError("Unable to get product!", err);
            }
        });
    }
    getProductPayload(userId_1, _a, event_1) {
        return __awaiter(this, arguments, void 0, function* (userId, { productId, qty }, event) {
            const product = yield this.repository.findById(productId);
            if (product) {
                const payload = {
                    event: event,
                    data: {
                        userId,
                        product,
                        qty,
                    },
                };
                return (0, utils_1.FormateData)(payload);
            }
            else {
                return (0, utils_1.FormateData)({ error: "No product available!" });
            }
        });
    }
}
exports.default = ProductService;
