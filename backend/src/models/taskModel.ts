import prisma from "../config/prisma";
import { CreateTaskPayload, Task, UpdateTaskPayload } from "../types";

export const getAllTasksByUserId = async (userId: number): Promise<Task[]> =>
  await prisma.task.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" }
  });

export const getTaskById = async (
  id: number,
  userId: number
): Promise<Task | null> =>
  await prisma.task.findFirst({ where: { id, userId } });

export const createTask = async (
  taskData: CreateTaskPayload,
  userId: number
): Promise<Task> =>
  await prisma.task.create({
    data: { ...taskData, userId }
  });

export const updateTask = async (
  id: number,
  userId: number,
  updatedTask: UpdateTaskPayload
): Promise<Task | null> => {
  try {
    return await prisma.task.update({
      where: { id, userId },
      data: updatedTask
    });
  } catch (e) {
    return null;
  }
};

export const deleteTask = async (id: number, userId: number) => {
  try {
    await prisma.task.delete({ where: { id, userId } });
    return true;
  } catch (e) {
    return false;
  }
};
