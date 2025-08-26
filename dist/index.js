"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_1 = require("./router/user");
const zap_1 = require("./router/zap");
const trigger_1 = require("./router/trigger");
const action_1 = require("./router/action");
const cors_1 = __importDefault(require("cors"));
const authMiddleware_1 = require("./middleware/authMiddleware");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use('/api/v1/user', user_1.userRouter);
app.use('/api/v1/zap', authMiddleware_1.authMiddleware, zap_1.zapRouter);
app.use('/api/v1/trigger', authMiddleware_1.authMiddleware, trigger_1.triggerRouter);
app.use('/api/v1/action', authMiddleware_1.authMiddleware, action_1.actionRouter);
app.get('/', (req, res) => {
    res.send('Welcome to the Primary Backend API');
});
app.listen(3000, () => {
    console.log(`Server is running on port 3000`);
});
