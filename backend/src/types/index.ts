import { Request } from "express";
import { z } from "zod";

export const PrioritySchema = z.enum(["low", "medium", "high"], {
  message: "Priority must be 'low', 'medium', or 'high'"
});
export type Priority = z.infer<typeof PrioritySchema>;

export const TaskSchema = z.object({
  id: z.number().int().positive(),
  name: z
    .string("Name must be a string")
    .trim()
    .min(1, "Name cannot be empty")
    .max(200, "Name must not exceed 200 characters"),
  done: z.boolean(),
  priority: PrioritySchema,
  createdAt: z.date(),
  updatedAt: z.date(),
  userId: z.number().int().positive()
});
export type Task = z.infer<typeof TaskSchema>;

export const CreateTaskPayloadSchema = TaskSchema.pick({
  name: true,
  priority: true
});
export type CreateTaskPayload = z.infer<typeof CreateTaskPayloadSchema>;

export const UpdateTaskPayloadSchema = TaskSchema.pick({
  name: true,
  priority: true,
  done: true
}).partial();

export type UpdateTaskPayload = z.infer<typeof UpdateTaskPayloadSchema>;

export const UserSchema = z.object({
  id: z.number().int().positive(),
  email: z.email("Invalid email"),
  name: z
    .string("Name must be a string")
    .trim()
    .min(1, "Name cannot be empty")
    .max(100, "Name must not exceed 100 characters"),
  password: z.string(),
  createdAt: z.date(),
  updatedAt: z.date()
});

export type User = z.infer<typeof UserSchema>;

export const RegistrationPayloadSchema = z.object({
  email: z.email("Invalid email"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(100, "Password must not exceed 100 characters"),
  name: z
    .string("Name must be a string")
    .trim()
    .min(1, "Name cannot be empty")
    .max(100, "Name must not exceed 100 characters")
});

export type RegistrationPayload = z.infer<typeof RegistrationPayloadSchema>;

export const LoginPayloadSchema = z.object({
  email: z.email("Invalid email"),
  password: z.string().min(1, "Password is required")
});

export type LoginPayload = z.infer<typeof LoginPayloadSchema>;

export interface AuthRequest extends Request {
  userId?: number;
}
