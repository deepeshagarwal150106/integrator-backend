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
Object.defineProperty(exports, "__esModule", { value: true });
exports.zapRouter = void 0;
const express_1 = require("express");
const types_1 = require("../types");
const index_1 = require("../db/index");
const zapRouter = (0, express_1.Router)();
exports.zapRouter = zapRouter;
zapRouter.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    const parseData = types_1.zapCreateSchema.safeParse(body);
    if (!parseData.success) {
        return res.status(400).send(parseData.error);
    }
    //@ts-ignore
    const email = req.email;
    const { availableTriggerId, metadata, actions } = parseData.data;
    try {
        const zap = yield index_1.prismaClient.zap.create({
            data: {
                //@ts-ignore
                userEmail: email,
                trigger: {
                    create: {
                        metadata: metadata || {},
                        availableTriggerId: availableTriggerId,
                    },
                },
                actions: {
                    create: actions.map((action, idx) => ({
                        availableActionId: action.availableActionId,
                        metadata: action.metadata,
                        sortingOrder: idx,
                    })),
                },
            },
        });
        res.status(201).json({ message: "Zap created successfully" });
    }
    catch (error) {
        console.error("Error creating zap:", error);
        res.status(500).send("Internal server error");
    }
}));
zapRouter.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //@ts-ignore
    const email = req.email;
    const zaps = yield index_1.prismaClient.zap.findMany({
        where: {
            userEmail: email,
        },
        include: {
            trigger: {
                include: {
                    type: true,
                },
            },
            actions: {
                include: {
                    type: true,
                },
            },
        },
    });
    res.json({ zaps });
}));
zapRouter.get("/:zapId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //@ts-ignore
    const email = req.email;
    const zap = yield index_1.prismaClient.zap.findUnique({
        where: {
            id: req.params.zapId,
            userEmail: email, //this is important it checks ki ham doosre kisi ki zap na dekh le
        },
        include: {
            trigger: {
                include: {
                    type: true,
                },
            },
            actions: {
                include: {
                    type: true,
                },
            },
        },
    });
    res.json(zap);
}));
