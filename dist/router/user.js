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
exports.userRouter = void 0;
const express_1 = require("express");
const types_1 = require("../types");
const index_1 = require("../db/index");
const argon2_1 = __importDefault(require("argon2"));
const userRouter = (0, express_1.Router)();
exports.userRouter = userRouter;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authMiddleware_1 = require("../middleware/authMiddleware");
userRouter.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = types_1.SignupSchema.safeParse(req.body);
        if (!result.success) {
            return res.status(400).send(result.error);
        }
        const { email, password, name } = result.data;
        const existingUser = yield index_1.prismaClient.user.findUnique({
            where: {
                email,
            },
        });
        if (existingUser) {
            return res.status(400).send("User already exists");
        }
        const secret = Buffer.from(process.env.SECRET_KEY || "mysecretkey");
        const hashed = yield argon2_1.default.hash(password, {
            secret,
            type: argon2_1.default.argon2id,
        });
        const user = yield index_1.prismaClient.user.create({
            data: {
                name,
                email,
                password: hashed,
            },
        });
        res.send("User signed up");
    }
    catch (error) {
        console.error("Error during signup:", error);
        res.status(500).send("Internal server error");
    }
}));
userRouter.post("/signin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Signin request received:", req.body);
    try {
        const result = types_1.SigninSchema.safeParse(req.body);
        if (!result.success) {
            return res.status(400).send(result.error);
        }
        const { email, password } = result.data;
        const user = yield index_1.prismaClient.user.findUnique({
            where: {
                email,
            },
        });
        if (!user) {
            return res.status(404).send("User not found");
        }
        const secret = Buffer.from(process.env.SECRET_KEY || "mysecretkey");
        const isMatch = yield argon2_1.default.verify(user.password, password, { secret });
        if (!isMatch) {
            return res.status(401).send("Invalid credentials");
        }
        const JWT_SECRET = process.env.JWT_SECRET || "mysecretkey";
        const token = jsonwebtoken_1.default.sign({ email: user.email }, JWT_SECRET, {
            expiresIn: "1h",
        });
        res.json({ token });
    }
    catch (error) {
        console.error("Error during signin:", error);
        res.status(500).send("Internal server error");
    }
}));
userRouter.get("/", authMiddleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield index_1.prismaClient.user.findFirst({
            where: {
                //@ts-ignore
                email: req.email,
            },
        });
        res.json(user);
    }
    catch (error) {
        res.status(500).send("Internal server error");
    }
}));
