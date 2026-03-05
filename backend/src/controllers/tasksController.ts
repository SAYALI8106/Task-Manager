import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import * as TaskModel from "../models/taskModel";
import { AuthRequest, Priority } from "../types";

// GET /api/tasks - Get all tasks (search + filters + sort + pagination)
export const getTasks = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!ensureIsAuthenticated(req, res)) return;

    let tasks = await TaskModel.getAllTasksByUserId(req.userId!);
    /* DEFAULT ORDER */
    tasks = [...tasks].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    /* SEARCH */
    const q = typeof req.query.q === "string" ? req.query.q.trim() : "";
    if (q) {
      const search = q.toLowerCase();
      tasks = tasks.filter((task) => task.name.toLowerCase().includes(search));
    }

    /* FILTER BY PRIORITY */
    const priority =
      typeof req.query.priority === "string" ? req.query.priority : undefined;

    if (priority) {
      tasks = tasks.filter((task) => task.priority === priority);
    }

    /* FILTER BY DONE STATUS */
    if (req.query.done !== undefined) {
      const done = req.query.done === "true";
      tasks = tasks.filter((task) => task.done === done);
    }

    /* SORTING */
    const sortBy = req.query.sortBy as "name" | "priority" | "done" | undefined;

    const order = req.query.order === "desc" ? "desc" : "asc";

    const priorityOrder: Record<Priority, number> = {
      high: 3,
      medium: 2,
      low: 1
    };

    if (sortBy) {
      tasks = [...tasks].sort((a, b) => {
        let aValue: string | boolean | number = a[sortBy];
        let bValue: string | boolean | number = b[sortBy];

        if (sortBy === "priority") {
          const aPriority = aValue as Priority;
          const bPriority = bValue as Priority;

          aValue = priorityOrder[aPriority];
          bValue = priorityOrder[bPriority];
        }

        if (aValue === bValue) return 0;

        return order === "desc"
          ? aValue > bValue
            ? -1
            : 1
          : aValue > bValue
            ? 1
            : -1;
      });
    }

    /* PAGINATION */
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    const paginatedTasks = tasks.slice(startIndex, endIndex);

    res.status(StatusCodes.OK).json({
      page,
      limit,
      total: tasks.length,
      totalPages: Math.ceil(tasks.length / limit),
      data: paginatedTasks
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/tasks/:id - Get a single task
export const getTask = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!ensureIsAuthenticated(req, res)) return;
    const { id } = req.params;
    const task = await TaskModel.getTaskById(Number(id), req.userId!);
    if (!task) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Task not found" });
    }

    res.status(StatusCodes.OK).json(task);
  } catch (error) {
    next(error);
  }
};

// POST /api/tasks - Create a task
export const createTask = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!ensureIsAuthenticated(req, res)) return;

    const newTask = await TaskModel.createTask(req.body, req.userId!);
    res.status(StatusCodes.CREATED).json(newTask);
  } catch (error) {
    next(error);
  }
};

// PUT /api/tasks/:id - Update a task
export const updateTask = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!ensureIsAuthenticated(req, res)) return;

    const { id } = req.params;
    const updatedTask = await TaskModel.updateTask(
      Number(id),
      req.userId!,
      req.body
    );
    if (!updatedTask) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Task not found" });
    }

    res.status(StatusCodes.OK).json(updatedTask);
  } catch (error) {
    next(error);
  }
};

// DELETE /api/tasks/:id - Delete a task
export const deleteTask = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!ensureIsAuthenticated(req, res)) return;

    const { id } = req.params;
    const deleted = await TaskModel.deleteTask(Number(id), req.userId!);

    if (!deleted) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Task not found" });
    }

    res.status(StatusCodes.NO_CONTENT).send();
  } catch (error) {
    next(error);
  }
};

// PATCH /api/tasks/:id/toggle
export const toggleTask = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!ensureIsAuthenticated(req, res)) return;

    const task = await TaskModel.getTaskById(
      Number(req.params.id),
      req.userId!
    );

    if (!task) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Task not found" });
    }

    const updated = await TaskModel.updateTask(task.id, req.userId!, {
      done: !task.done
    });

    res.status(StatusCodes.OK).json(updated);
  } catch (error) {
    next(error);
  }
};

// GET /api/tasks/stats
export const getTaskStats = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!ensureIsAuthenticated(req, res)) return;

    const tasks = await TaskModel.getAllTasksByUserId(req.userId!);
    const done = tasks.filter((t) => t.done).length;

    res.status(StatusCodes.OK).json({
      total: tasks.length,
      active: tasks.length - done,
      done
    });
  } catch (error) {
    next(error);
  }
};

const ensureIsAuthenticated = (req: AuthRequest, res: Response) => {
  if (!req.userId) {
    res.status(401).json({ message: "Not authenticated" });
    return false;
  }

  return true;
};
