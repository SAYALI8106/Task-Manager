import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { StatusCodes } from "http-status-codes";

export const validateRequest = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "Validation failed",
      errors: errors.array().map((err) => {
        if (err.type === "field") {
          return {
            field: err.path,
            message: err.msg
          };
        }

        return {
          field: "unknown",
          message: err.msg
        };
      })
    });
  }

  next();
};
