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
const shopping_repository_1 = __importDefault(require("../database/repository/shopping-repository"));
const utils_1 = require("../utils");
const app_errors_1 = require("../utils/app-errors");
class ShoppingService {
    constructor() {
        this.repository = new shopping_repository_1.default();
    }
    getCart(_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const cartItems = yield this.repository.Cart(_id);
                return (0, utils_1.FormateData)(cartItems);
            }
            catch (error) {
                throw new app_errors_1.APIError("Unable to get cart items", app_errors_1.STATUS_CODES.INTERNAL_ERROR, error.message || "Unable to get cart items!");
            }
        });
    }
    placeOrder(userInputs) {
        return __awaiter(this, void 0, void 0, function* () {
            const { _id, transactionId } = userInputs;
            try {
                const orderResult = yield this.repository.createNewOrder(_id, transactionId);
                return (0, utils_1.FormateData)(orderResult);
            }
            catch (error) {
                throw new app_errors_1.APIError("Unable to place order!", app_errors_1.STATUS_CODES.INTERNAL_ERROR, error.message || "Unable to place order!");
            }
        });
    }
    getOrders(customerId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const orders = yield this.repository.Orders(customerId);
                return (0, utils_1.FormateData)(orders);
            }
            catch (error) {
                throw new app_errors_1.APIError("Unable to get orders!", app_errors_1.STATUS_CODES.INTERNAL_ERROR, error.message || "Unable to get orders!");
            }
        });
    }
    manageCart(customerId, item, qty, isRemove) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const cart = yield this.repository.addCartItem(customerId, item, qty, isRemove);
                return (0, utils_1.FormateData)(cart);
            }
            catch (error) {
                throw new app_errors_1.APIError("Unable to get data!", app_errors_1.STATUS_CODES.INTERNAL_ERROR, error.message || "Unable to get orders!");
            }
        });
    }
    subscribeEvents(payload) {
        return __awaiter(this, void 0, void 0, function* () {
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
        });
    }
    getOrderPayload(userId, order, event) {
        return __awaiter(this, void 0, void 0, function* () {
            if (order) {
                const payload = {
                    event: event,
                    data: { userId, order },
                };
                return (0, utils_1.FormateData)(payload);
            }
            else {
                return (0, utils_1.FormateData)({ error: "No order available!" });
            }
        });
    }
}
exports.default = ShoppingService;
