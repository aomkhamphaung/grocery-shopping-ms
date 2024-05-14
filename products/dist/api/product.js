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
const express_1 = __importDefault(require("express"));
const product_service_1 = __importDefault(require("../services/product-service"));
const auth_1 = require("./middleware/auth");
const utils_1 = require("../utils");
const router = express_1.default.Router();
const service = new product_service_1.default();
router.post("/product/create", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, description, type, unit, price, isAvailable, supplier, banner, } = req.body;
        const { data } = yield service.createProduct({
            name,
            description,
            type,
            unit,
            price,
            isAvailable,
            supplier,
            banner,
        });
        return res.json(data);
    }
    catch (err) {
        next(err);
    }
}));
router.get("/category/:type", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const type = req.params.type;
    try {
        const { data } = yield service.getProductByCategory(type);
        return res.status(200).json(data);
    }
    catch (err) {
        next(err);
    }
}));
router.get("/:id", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const productId = req.params.id;
    try {
        const { data } = yield service.getProductDescription(productId);
        return res.status(200).json(data);
    }
    catch (err) {
        next(err);
    }
}));
router.post("/ids", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { ids } = req.body;
        const products = yield service.getSelectedProducts(ids);
        return res.status(200).json(products);
    }
    catch (err) {
        next(err);
    }
}));
router.put("/wishlist", auth_1.UserAuth, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { _id } = req.user;
    try {
        const { data } = yield service.getProductPayload(_id, {
            productId: req.body._id,
            qty: req.body.qty,
        }, "ADD_TO_WISHLIST");
        (0, utils_1.PublishCustomerEvent)(data);
        return res.status(200).json(data.data.product);
    }
    catch (err) { }
}));
router.delete("/wishlist/:id", auth_1.UserAuth, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { _id } = req.user;
    const productId = req.params.id;
    try {
        const { data } = yield service.getProductPayload(_id, {
            productId,
            qty: req.body,
        }, "REMOVE_FROM_WISHLIST");
        (0, utils_1.PublishCustomerEvent)(data);
        return res.status(200).json(data.data.product);
    }
    catch (err) {
        next(err);
    }
}));
router.put("/cart", auth_1.UserAuth, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { _id } = req.user;
    try {
        const { data } = yield service.getProductPayload(_id, {
            productId: req.body,
            qty: req.body.qty,
        }, "ADD_TO_CART");
        (0, utils_1.PublishCustomerEvent)(data);
        (0, utils_1.PublishShoppingEvent)(data);
        const result = {
            product: data.data.product,
            unit: data.data.qty,
        };
        return res.status(200).json(result);
    }
    catch (err) {
        next(err);
    }
}));
router.delete("/cart/:id", auth_1.UserAuth, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { _id } = req.user;
    try {
        const { data } = yield service.getProductPayload(_id, {
            productId: req.body,
            qty: req.body,
        }, "REMOVE_FROM_CART");
        (0, utils_1.PublishCustomerEvent)(data);
        (0, utils_1.PublishShoppingEvent)(data);
        const result = {
            product: data.data.product,
            unit: data.data.qty,
        };
        return res.status(200).json(result);
    }
    catch (err) {
        next(err);
    }
}));
router.get("/", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { data } = yield service.getAllProducts();
        return res.status(200).json(data);
    }
    catch (err) {
        next(err);
    }
}));
exports.default = router;
