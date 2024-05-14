"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const express_http_proxy_1 = __importDefault(require("express-http-proxy"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use("/customer", (0, express_http_proxy_1.default)("http://localhost:5001"));
app.use("/shopping", (0, express_http_proxy_1.default)("http://localhost:5003"));
app.use("/", (0, express_http_proxy_1.default)("http://localhost:5002"));
app.listen(5000, () => {
    console.log(`Server is up on port: 5000`);
});
