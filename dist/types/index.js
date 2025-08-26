"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.zapCreateSchema = exports.SigninSchema = exports.SignupSchema = void 0;
const zod_1 = require("zod");
exports.SignupSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, "Name is required"),
    email: zod_1.z.email("Invalid email address"),
    password: zod_1.z.string().min(3, "Password must be at least 3 characters long")
});
exports.SigninSchema = zod_1.z.object({
    email: zod_1.z.email("Invalid email address"),
    password: zod_1.z.string().min(3, "Password must be at least 3 characters long")
});
exports.zapCreateSchema = zod_1.z.object({
    availableTriggerId: zod_1.z.string(),
    metadata: zod_1.z.any().optional(),
    actions: zod_1.z.array(zod_1.z.object({
        availableActionId: zod_1.z.string(),
        metadata: zod_1.z.any().optional()
    }))
});
