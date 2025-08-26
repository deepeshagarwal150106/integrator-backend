import { Router } from "express";
import { zapCreateSchema } from "../types";
import { prismaClient } from "../db/index";

const zapRouter = Router();

zapRouter.post("/", async (req, res) => {
  const body = req.body;
  const parseData = zapCreateSchema.safeParse(body);
  if (!parseData.success) {
    return res.status(400).send(parseData.error);
  }

  //@ts-ignore
  const email = req.email;
  const { availableTriggerId, metadata, actions } = parseData.data;

  try {
    const zap = await prismaClient.zap.create({
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
  } catch (error) {
    console.error("Error creating zap:", error);
    res.status(500).send("Internal server error");
  }
});

zapRouter.get("/", async (req, res) => {
  //@ts-ignore
  const email = req.email;

  const zaps = await prismaClient.zap.findMany({
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
});

zapRouter.get("/:zapId", async (req, res) => {
  //@ts-ignore
  const email = req.email;

  const zap = await prismaClient.zap.findUnique({
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
});

export { zapRouter };
