import { Router } from "express";
import { prismaClient } from "../db/index";

const actionRouter = Router();

actionRouter.post("/", (req, res) => {
  // Handle action creation
});

actionRouter.get("/available", async (req, res) => {
  // Handle fetching actions
  const availableActions = await prismaClient.availableActions.findMany({});
  res.json({availableActions});
});

export { actionRouter };
