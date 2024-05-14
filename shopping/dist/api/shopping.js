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
const shopping_service_1 = __importDefault(require("../services/shopping-service"));
const auth_1 = require("./middlewares/auth");
const utils_1 = require("../utils");
const router = express_1.default.Router();
const service = new shopping_service_1.default();
router.post("/order", auth_1.UserAuth, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { _id } = req.user;
    const { transactionId } = req.body;
    try {
        const { data } = yield service.placeOrder({ _id, transactionId });
        const payload = yield service.getOrderPayload(_id, data, "CREATE_ORDER");
        (0, utils_1.PublishCustomerEvent)(payload);
        return res.status(200).json(data);
    }
    catch (err) {
        next(err);
    }
}));
router.get("/orders", auth_1.UserAuth, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { _id } = req.user;
    try {
        const { data } = yield service.getOrders(_id);
        return res.status(200).json(data);
    }
    catch (err) {
        next(err);
    }
}));
router.get("/cart", auth_1.UserAuth, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { _id } = req.user;
    try {
        const { data } = yield service.getCart(_id);
        return res.status(200).json(data);
    }
    catch (err) {
        next(err);
    }
}));
exports.default = router;
