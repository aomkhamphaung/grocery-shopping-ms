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
Object.defineProperty(exports, "__esModule", { value: true });
const app_errors_1 = require("../../utils/app-errors");
const models_1 = require("../models");
class ProductRepository {
    createProduct(_a) {
        return __awaiter(this, arguments, void 0, function* ({ name, description, type, unit, price, isAvailable, supplier, banner, }) {
            try {
                const product = new models_1.Product({
                    name,
                    description,
                    type,
                    unit,
                    price,
                    isAvailable,
                    supplier,
                    banner,
                });
                const result = yield product.save();
                return result;
            }
            catch (err) {
                throw new app_errors_1.APIError("API_ERROR", app_errors_1.STATUS_CODES.INTERNAL_ERROR, "Unable to create product!");
            }
        });
    }
    getAllProducts() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield models_1.Product.find();
            }
            catch (err) {
                throw new app_errors_1.APIError("API_ERROR", app_errors_1.STATUS_CODES.INTERNAL_ERROR, "Unable to get products!");
            }
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield models_1.Product.findById(id);
            }
            catch (err) {
                throw new app_errors_1.APIError("API_ERROR", app_errors_1.STATUS_CODES.INTERNAL_ERROR, "Unable to find product!");
            }
        });
    }
    findByCategory(category) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield models_1.Product.find({ type: category });
            }
            catch (err) {
                throw new app_errors_1.APIError("API_ERROR", app_errors_1.STATUS_CODES.INTERNAL_ERROR, "Unable to find product with this category!");
            }
        });
    }
    findSelectedProducts(selectedIds) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const products = yield models_1.Product.find()
                    .where("_id")
                    .in(selectedIds.map((_id) => _id))
                    .exec();
                return products;
            }
            catch (err) {
                throw new app_errors_1.APIError("API_ERROR", app_errors_1.STATUS_CODES.INTERNAL_ERROR, "Unable to find products!");
            }
        });
    }
}
exports.default = ProductRepository;
