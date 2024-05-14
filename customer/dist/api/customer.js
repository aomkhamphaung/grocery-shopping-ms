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
const customer_service_1 = __importDefault(require("../services/customer-service"));
const auth_1 = require("./middlewares/auth");
const router = express_1.default.Router();
const service = new customer_service_1.default();
router.post("/signup", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password, phone } = req.body;
        const { data } = yield service.signUp({ email, password, phone });
        return res.json(data);
    }
    catch (err) {
        next(err);
    }
}));
router.post("/login", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const { data } = yield service.signIn({ email, password });
        return res.json(data);
    }
    catch (err) {
        next(err);
    }
}));
router.post("/address", auth_1.UserAuth, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { _id } = req.user;
        const { street, postalCode, city, country } = req.body;
        const { data } = yield service.addNewAddress(_id, {
            street,
            postalCode,
            city,
            country,
        });
        return res.json(data);
    }
    catch (err) {
        next(err);
    }
}));
router.get("/profile", auth_1.UserAuth, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { _id } = req.user;
        const { data } = yield service.getProfile(_id);
        return res.json(data);
    }
    catch (err) {
        next(err);
    }
}));
router.get("/shopping-details", auth_1.UserAuth, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { _id } = req.user;
        const { data } = yield service.getShoppingDetails(_id);
        return res.json(data);
    }
    catch (err) {
        next(err);
    }
}));
router.get("/wishlist", auth_1.UserAuth, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { _id } = req.user;
        const { data } = yield service.getWishlist(_id);
        return res.status(200).json(data);
    }
    catch (err) {
        next(err);
    }
}));
exports.default = router;
