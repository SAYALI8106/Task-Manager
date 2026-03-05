import jwt from "jsonwebtoken";
import z from "zod";
import { NextFunction, Request, Response } from "express";
import { fetchEnvVar } from "../utils";
import { AuthRequest } from "../types";

export const JWT_SECRET = fetchEnvVar("JWT_SECRET");

export const authenticate = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies?.token;
    const tokenResult = z.string().optional().safeParse(token);
    if (!tokenResult.success || !tokenResult.data) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const decodedToken = jwt.verify(tokenResult.data, JWT_SECRET);
    const decodedTokenResult = z
      .object({ userId: z.number().int() })
      .safeParse(decodedToken);

    if (!decodedTokenResult.success) {
      return res.status(401).json({ message: "Invalid or missing token" });
    }

    req.userId = decodedTokenResult.data.userId;
    next();
  } catch (e) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
