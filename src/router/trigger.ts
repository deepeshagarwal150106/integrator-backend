import { Router } from "express";
import {prismaClient} from "../db/index";

const triggerRouter = Router();

triggerRouter.post("/", (req, res) => {
  // Handle trigger creation
});

triggerRouter.get("/available", async (req, res) => {
  const availableTriggers = await prismaClient.availableTriggers.findMany({});
  console.log("Available Triggers", availableTriggers);
  res.json({availableTriggers});
});

export { triggerRouter };

