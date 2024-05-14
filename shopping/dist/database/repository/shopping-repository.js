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
const uuid_1 = require("uuid");
class ShoppingRepository {
    Orders(customerId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const orders = yield models_1.Order.findById({ customerId });
                return orders;
            }
            catch (err) {
                throw new app_errors_1.APIError("API Error", app_errors_1.STATUS_CODES.INTERNAL_ERROR, "Unable to find orders");
            }
        });
    }
    Cart(customerId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const cartItems = yield models_1.Cart.find({ customerId: customerId });
                if (cartItems) {
                    return cartItems;
                }
            }
            catch (err) {
                throw new app_errors_1.APIError("API Error", app_errors_1.STATUS_CODES.INTERNAL_ERROR, "Data not found!");
            }
        });
    }
    addCartItem(customerId, item, qty, isRemove) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let cart = yield models_1.Cart.findOne({ customerId: customerId });
                if (!cart) {
                    cart = yield models_1.Cart.create({ customerId, items: [] });
                }
                const cartItems = cart.items || [];
                const existingItem = cartItems.find((cartItem) => cartItem.product._id.toString() === item._id.toString());
                if (existingItem) {
                    if (isRemove) {
                        cartItems.splice(cartItems.indexOf(existingItem), 1);
                    }
                    else {
                        existingItem.unit = qty;
                    }
                }
                else if (!isRemove) {
                    cartItems.push({ product: Object.assign({}, item), unit: qty });
                }
                cart.items = cartItems;
                yield cart.save();
                return cart;
            }
            catch (err) {
                throw new app_errors_1.APIError("API ERROR", app_errors_1.STATUS_CODES.INTERNAL_ERROR, "Unable to add to cart!");
            }
        });
    }
    createNewOrder(customerId, transactionId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const cart = yield models_1.Cart.findOne({ customerId: customerId });
                if (cart) {
                    let amount = 0;
                    let cartItems = cart.items;
                    if (cartItems.length > 0) {
                        cartItems.map((item) => {
                            amount += item.product.price * item.unit;
                        });
                        const orderId = (0, uuid_1.v4)();
                        const order = new models_1.Order({
                            orderId,
                            customerId,
                            amount,
                            transactionId,
                            status: "received",
                            items: cartItems,
                        });
                        cart.items = [];
                        const result = yield order.save();
                        yield cart.save();
                        return result;
                    }
                }
            }
            catch (err) {
                throw new app_errors_1.APIError("API Error", app_errors_1.STATUS_CODES.INTERNAL_ERROR, "Unable to create order!");
            }
        });
    }
}
exports.default = ShoppingRepository;
