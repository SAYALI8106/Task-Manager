import { NextFunction, Request, Response } from "express";
import { LoginPayloadSchema, RegistrationPayloadSchema } from "../types";
import { getErrorMessage } from "../utils";

export const validateRegister = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const result = RegistrationPayloadSchema.safeParse(req.body);

  if (!result.success) {
    return res
      .status(400)
      .json({ message: getErrorMessage(result.error.issues) });
  }

  next();
};

export const validateLogin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const result = LoginPayloadSchema.safeParse(req.body);

  if (!result.success) {
    return res
      .status(400)
      .json({ message: getErrorMessage(result.error.issues) });
  }

  next();
};
