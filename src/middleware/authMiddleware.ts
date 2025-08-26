import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const token = req.headers.authorization as unknown as string;
    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const payload = jwt.verify(token, process.env.JWT_SECRET || "mysecretkey");
    // @ts-ignore
    req.email = payload.email;
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    return res.status(401).json({ error: "Unauthorized" });
  }
}
