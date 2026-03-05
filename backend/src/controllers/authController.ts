import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import {
  AuthRequest,
  LoginPayloadSchema,
  RegistrationPayloadSchema
} from "./../types";
import * as UserModel from "../models/userModel";
import { JWT_SECRET } from "../middlewares/auth";

const JWT_EXPIRES_IN = "7d";
const TOKEN_COOKIE_NAME = "token";

// POST /api/auth/register
export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password, name } = RegistrationPayloadSchema.parse(req.body);

    const existingUser = await UserModel.findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const user = await UserModel.createUser({ email, password, name });

    signAndSetJwtTokenInCookie(user.id, res);

    res.status(201).json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/auth/login
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = LoginPayloadSchema.parse(req.body);
    const user = await UserModel.findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isValidPassword = await UserModel.verifyPassword(
      password,
      user.password
    );
    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    signAndSetJwtTokenInCookie(user.id, res);

    res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    });
  } catch (error) {
    next(error);
  }
};

const signAndSetJwtTokenInCookie = (userId: number, res: Response) => {
  const token = jwt.sign({ userId: userId }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN
  });

  const isProduction = process.env.NODE_ENV === "production";

  res.cookie(TOKEN_COOKIE_NAME, token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  });
};

// POST /api/auth/logout
export const logout = async (
  _req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const isProduction = process.env.NODE_ENV === "production";
    res.clearCookie(TOKEN_COOKIE_NAME, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax"
    });

    res.json({ message: "Logged out successfully" });
  } catch (error) {
    next(error);
  }
};

// GET /api/auth/profile
export const getCurrentUser = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const user = await UserModel.findUserById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ user });
  } catch (error) {
    next(error);
  }
};
