"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DB_URI = exports.PORT = exports.APP_SECRET = void 0;
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
exports.APP_SECRET = process.env.APP_SECRET || "";
exports.PORT = process.env.PORT || 5001;
exports.DB_URI = process.env.MONGODB_URI ||
    "";
