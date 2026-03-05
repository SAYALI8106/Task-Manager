import { body, param } from "express-validator";
import type { Priority } from "../types";

const PRIORITIES = [
  "low",
  "medium",
  "high"
] as const satisfies readonly Priority[];

/* CREATE */

export const createTaskValidator = [
  body("name")
    .exists({ checkFalsy: true })
    .withMessage("Name is required")
    .isString()
    .withMessage("Name must be a string")
    .isLength({ min: 1, max: 200 })
    .withMessage("Name must be between 1 and 200 characters"),

  body("priority")
    .optional()
    .isIn(PRIORITIES)
    .withMessage(`Priority must be one of: ${PRIORITIES.join(", ")}`)
];

/* UPDATE */

export const updateTaskValidator = [
  param("id").isNumeric().withMessage("Task ID must be a number"),

  body("name")
    .optional()
    .isString()
    .withMessage("Name must be a string")
    .isLength({ min: 1, max: 200 })
    .withMessage("Name must be between 1 and 200 characters"),

  body("priority")
    .optional()
    .isIn(PRIORITIES)
    .withMessage(`Priority must be one of: ${PRIORITIES.join(", ")}`),

  body("done").optional().isBoolean().withMessage("Done must be a boolean")
];

/* ID PARAM */

export const taskIdValidator = [
  param("id").isNumeric().withMessage("Task ID must be a number")
];
