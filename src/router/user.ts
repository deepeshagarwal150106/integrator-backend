import { Router } from "express";
import { SigninSchema, SignupSchema } from "../types";
import { prismaClient } from "../db/index";
import argon2 from "argon2";
const userRouter = Router();
import Jwt from "jsonwebtoken";
import { authMiddleware } from "../middleware/authMiddleware";

userRouter.post("/signup", async (req, res) => {
  try {
    const result = SignupSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).send(result.error);
    }
    const { email, password, name } = result.data;
    const existingUser = await prismaClient.user.findUnique({
      where: {
        email,
      },
    });
    if (existingUser) {
      return res.status(400).send("User already exists");
    }

    const secret = Buffer.from(process.env.SECRET_KEY || "mysecretkey");

    const hashed = await argon2.hash(password, {
      secret,
      type: argon2.argon2id,
    });

    const user = await prismaClient.user.create({
      data: {
        name,
        email,
        password: hashed,
      },
    });
    res.send("User signed up");
  } catch (error) {
    console.error("Error during signup:", error);
    res.status(500).send("Internal server error");
  }
});

userRouter.post("/signin", async (req, res) => {
  console.log("Signin request received:", req.body);
  try {
    const result = SigninSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).send(result.error);
    }
    const { email, password } = result.data;
    const user = await prismaClient.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return res.status(404).send("User not found");
    }
    const secret = Buffer.from(process.env.SECRET_KEY || "mysecretkey");

    const isMatch = await argon2.verify(user.password, password, { secret });
    if (!isMatch) {
      return res.status(401).send("Invalid credentials");
    }

    const JWT_SECRET = process.env.JWT_SECRET || "mysecretkey";

    const token = Jwt.sign({ email: user.email }, JWT_SECRET, {
      expiresIn: "1h",
    });
    res.json({ token });
  } catch (error) {
    console.error("Error during signin:", error);
    res.status(500).send("Internal server error");
  }
});

userRouter.get("/", authMiddleware, async (req, res) => {
  try {
    const user = await prismaClient.user.findFirst({
      where: {
        //@ts-ignore
        email: req.email,
      },
    });
    res.json(user);
  } catch (error) {
    res.status(500).send("Internal server error");
  }
});

export { userRouter };
