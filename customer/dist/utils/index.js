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
exports.FormateData = exports.ValidateToken = exports.GenerateToken = exports.ValidatePassword = exports.GeneratePassword = exports.GenerateSalt = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config");
const GenerateSalt = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield bcrypt_1.default.genSalt();
});
exports.GenerateSalt = GenerateSalt;
const GeneratePassword = (password, salt) => __awaiter(void 0, void 0, void 0, function* () {
    return yield bcrypt_1.default.hash(password, salt);
});
exports.GeneratePassword = GeneratePassword;
const ValidatePassword = (enterPassword, savedPassword, salt) => __awaiter(void 0, void 0, void 0, function* () {
    return (yield (0, exports.GeneratePassword)(enterPassword, salt)) === savedPassword;
});
exports.ValidatePassword = ValidatePassword;
const GenerateToken = (payload) => {
    try {
        return jsonwebtoken_1.default.sign(payload, config_1.APP_SECRET, { expiresIn: "30d" });
    }
    catch (error) {
        console.log(error);
        return error;
    }
};
exports.GenerateToken = GenerateToken;
const ValidateToken = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.get("Authorization");
        const payload = yield jsonwebtoken_1.default.verify(token.split(" ")[1], config_1.APP_SECRET);
        req.user = payload;
        return true;
    }
    catch (error) {
        console.log(error);
        return false;
    }
});
exports.ValidateToken = ValidateToken;
const FormateData = (data) => {
    if (data) {
        return { data };
    }
    else {
        throw new Error("Data not found!");
    }
};
exports.FormateData = FormateData;
