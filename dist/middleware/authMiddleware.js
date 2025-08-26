"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = authMiddleware;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function authMiddleware(req, res, next) {
    try {
        const token = req.headers.authorization;
        if (!token) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        const payload = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || "mysecretkey");
        // @ts-ignore
        req.email = payload.email;
        next();
    }
    catch (error) {
        console.error("Authentication error:", error);
        return res.status(401).json({ error: "Unauthorized" });
    }
}
