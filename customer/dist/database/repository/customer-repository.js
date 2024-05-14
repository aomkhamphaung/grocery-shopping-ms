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
const models_1 = require("../models");
const app_errors_1 = require("../../utils/app-errors");
class CustomerRepository {
    createCustomer(_a) {
        return __awaiter(this, arguments, void 0, function* ({ email, password, phone, salt }) {
            try {
                const customer = new models_1.Customer({
                    email,
                    password,
                    salt,
                    phone,
                    address: [],
                });
                const customerResult = yield customer.save();
                return customerResult;
            }
            catch (err) {
                throw new app_errors_1.APIError("API Error", app_errors_1.STATUS_CODES.INTERNAL_ERROR, "Unable to Create Customer");
            }
        });
    }
    createAddress(_a) {
        return __awaiter(this, arguments, void 0, function* ({ _id, street, postalCode, city, country, }) {
            try {
                const profile = yield models_1.Customer.findById(_id);
                if (profile) {
                    const newAddress = new models_1.Address({
                        street,
                        postalCode,
                        city,
                        country,
                    });
                    yield newAddress.save();
                    profile.address.push(newAddress);
                }
                return yield profile.save();
            }
            catch (err) {
                throw new app_errors_1.APIError("API Error", app_errors_1.STATUS_CODES.INTERNAL_ERROR, "Error on Create Address");
            }
        });
    }
    findCustomer(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const existingCustomer = yield models_1.Customer.findOne({ email });
                return existingCustomer;
            }
            catch (err) {
                throw new app_errors_1.APIError("API Error", app_errors_1.STATUS_CODES.INTERNAL_ERROR, "Unable to Find Customer");
            }
        });
    }
    findCustomerById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const existingCustomer = yield models_1.Customer.findById(id).populate("address");
                return existingCustomer;
            }
            catch (err) {
                throw new app_errors_1.APIError("API Error", app_errors_1.STATUS_CODES.INTERNAL_ERROR, "Unable to Find Customer");
            }
        });
    }
    wishlist(customerId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const profile = yield models_1.Customer.findById(customerId).populate("wishlist");
                return profile.wishlist;
            }
            catch (err) {
                throw new app_errors_1.APIError("API ERROR", app_errors_1.STATUS_CODES.INTERNAL_ERROR, "Unable to get wishlist");
            }
        });
    }
    addWishlistItem(customerId_1, _a) {
        return __awaiter(this, arguments, void 0, function* (customerId, { _id, name, description, price, banner, isAvailable }) {
            const product = { _id, name, description, price, banner, isAvailable };
            try {
                const profile = yield models_1.Customer.findById(customerId).populate("wishlist");
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
                    }
                    else {
                        wishlist.push(product);
                    }
                    profile.wishlist = wishlist;
                }
                const result = yield profile.save();
                return result.wishlist;
            }
            catch (err) {
                throw new app_errors_1.APIError("API ERROR", app_errors_1.STATUS_CODES.INTERNAL_ERROR, "Unable to add to wishlist");
            }
        });
    }
    addCartItem(customerId, product, qty, isRemove) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const profile = yield models_1.Customer.findById(customerId);
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
                            if (item.product._id.toString() === cartItem.product._id.toString()) {
                                if (isRemove) {
                                    cartItems.splice(cartItems.indexOf(item), 1);
                                }
                                else {
                                    item.unit = qty;
                                }
                                isExist = true;
                            }
                        });
                        if (!isExist) {
                            cartItems.push(cartItem);
                        }
                    }
                    else {
                        cartItems.push(cartItem);
                    }
                    profile.cart = cartItems;
                    const result = yield profile.save();
                    return result;
                }
                throw new Error("Unable to add to cart!");
            }
            catch (err) {
                throw new app_errors_1.APIError("API ERROR", app_errors_1.STATUS_CODES.INTERNAL_ERROR, "Unable to add to cart!");
            }
        });
    }
    addOrder(customerId, order) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const profile = yield models_1.Customer.findById(customerId);
                if (profile) {
                    if (profile.orders === undefined) {
                        profile.orders = [];
                    }
                    profile.orders.push(order);
                    profile.cart = [];
                    const result = yield profile.save();
                    return result;
                }
                throw new Error("Unable to create order!");
            }
            catch (err) {
                throw new app_errors_1.APIError("API ERROR", app_errors_1.STATUS_CODES.INTERNAL_ERROR, "Unable to create order!");
            }
        });
    }
}
exports.default = CustomerRepository;
