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
const customer_repository_1 = __importDefault(require("../database/repository/customer-repository"));
const utils_1 = require("../utils");
const app_errors_1 = require("../utils/app-errors");
class CustomerService {
    constructor() {
        this.repository = new customer_repository_1.default();
    }
    signIn(userInputs) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password } = userInputs;
            try {
                const existingCustomer = yield this.repository.findCustomer(email);
                if (!existingCustomer) {
                    throw new app_errors_1.APIError("Customer not found", app_errors_1.STATUS_CODES.NOT_FOUND, "Customer not found");
                }
                const validPassword = yield (0, utils_1.ValidatePassword)(password, existingCustomer.password, existingCustomer.salt);
                if (!validPassword) {
                    throw new app_errors_1.APIError("Invalid password", app_errors_1.STATUS_CODES.UNAUTHORIZED, "Invalid password");
                }
                const token = yield (0, utils_1.GenerateToken)({
                    email: existingCustomer.email,
                    _id: existingCustomer._id,
                });
                return (0, utils_1.FormateData)({ id: existingCustomer._id, token });
            }
            catch (error) {
                throw new app_errors_1.APIError("Sign-in failed", app_errors_1.STATUS_CODES.INTERNAL_ERROR, error.message || "Sign-in failed");
            }
        });
    }
    signUp(userInputs) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password, phone } = userInputs;
            try {
                const existingCustomer = yield this.repository.findCustomer(email);
                if (existingCustomer) {
                    throw new app_errors_1.APIError("Email already exists", app_errors_1.STATUS_CODES.CONFLICT, "Email already exists");
                }
                let salt = yield (0, utils_1.GenerateSalt)();
                let userPassword = yield (0, utils_1.GeneratePassword)(password, salt);
                const createdCustomer = yield this.repository.createCustomer({
                    email,
                    password: userPassword,
                    phone,
                    salt,
                });
                const token = yield (0, utils_1.GenerateToken)({ email, _id: createdCustomer._id });
                return (0, utils_1.FormateData)({ id: createdCustomer._id, token });
            }
            catch (error) {
                throw new app_errors_1.APIError("Sign-up failed", app_errors_1.STATUS_CODES.INTERNAL_ERROR, error.message || "Sign-up failed");
            }
        });
    }
    addNewAddress(_id, userInputs) {
        return __awaiter(this, void 0, void 0, function* () {
            const { street, postalCode, city, country } = userInputs;
            try {
                const addressResult = yield this.repository.createAddress({
                    _id,
                    street,
                    postalCode,
                    city,
                    country,
                });
                return (0, utils_1.FormateData)(addressResult);
            }
            catch (error) {
                throw new app_errors_1.APIError("Add address failed", app_errors_1.STATUS_CODES.INTERNAL_ERROR, error.message || "Add address failed");
            }
        });
    }
    getProfile(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const existingCustomer = yield this.repository.findCustomerById(id);
                return (0, utils_1.FormateData)(existingCustomer);
            }
            catch (err) {
                throw new app_errors_1.APIError("Data Not found", err);
            }
        });
    }
    getShoppingDetails(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const existingCustomer = yield this.repository.findCustomerById(id);
                if (existingCustomer) {
                    return (0, utils_1.FormateData)(existingCustomer);
                }
                return (0, utils_1.FormateData)({ message: "Error" });
            }
            catch (err) {
                throw new app_errors_1.APIError("Data not found!", err);
            }
        });
    }
    getWishlist(customerId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const wishListItems = yield this.repository.wishlist(customerId);
                return (0, utils_1.FormateData)(wishListItems);
            }
            catch (err) {
                throw new app_errors_1.APIError("Data Not found", err);
            }
        });
    }
    addToWishlist(customerId, product) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const wishlistResult = yield this.repository.addWishlistItem(customerId, product);
                return (0, utils_1.FormateData)(wishlistResult);
            }
            catch (err) {
                throw new app_errors_1.APIError("Data Not found", err);
            }
        });
    }
    manageCart(customerId, product, qty, isRemove) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.repository.addCartItem(customerId, product, qty, isRemove);
                return (0, utils_1.FormateData)(result);
            }
            catch (err) {
                throw new app_errors_1.APIError("Data not found!", err);
            }
        });
    }
    manageOrder(customerId, order) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.repository.addOrder(customerId, order);
                return (0, utils_1.FormateData)(result);
            }
            catch (err) {
                throw new app_errors_1.APIError("Data not found!", err);
            }
        });
    }
    subscribeEvents(payload) {
        const { event, data } = payload;
        const { userId, product, order, qty } = data;
        switch (event) {
            case "ADD_TO_WISHLIST":
            case "REMOVE_FROM_WISHLIST":
                this.addToWishlist(userId, product);
                break;
            case "ADD_TO_CART":
                this.manageCart(userId, product, qty, false);
                break;
            case "REMOVE_FROM_CART":
                this.manageCart(userId, product, qty, true);
                break;
            case "CREATE_ORDER":
                this.manageOrder(userId, order);
                break;
            case "TEST":
                console.log("WORKING...");
                break;
            default:
                break;
        }
    }
}
exports.default = CustomerService;
