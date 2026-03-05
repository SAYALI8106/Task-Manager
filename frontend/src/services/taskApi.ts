import { Priority, Task } from "../types";
import api from "./api";

export type NewTaskData = Pick<Task, "name" | "priority">;

export type UpdateTaskData = {
  name?: string;
  priority?: Priority;
  done?: boolean;
};

export type PaginatedTasks = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  data: Task[];
};

export type TaskStats = {
  total: number;
  active: number;
  done: number;
};

export type GetTasksParams = {
  q?: string; // search
  priority?: "low" | "medium" | "high";
  done?: boolean;
  sortBy?: "priority" | "createdAt" | "updatedAt" | "name";
  order?: "asc" | "desc";
  page?: number;
  limit?: number;
};

export const taskApi = {
  // GET /api/tasks?filter=&sort=&order=&search=
  getAllTasks: async (params?: GetTasksParams) => {
    const response = await api.get<PaginatedTasks>("/tasks", { params });
    return response.data;
  },

  getTask: async (id: number) => {
    const response = await api.get<Task>(`/tasks/${id}`);
    return response.data;
  },

  createTask: async (taskData: NewTaskData) => {
    const response = await api.post<Task>("/tasks", taskData);
    return response.data;
  },

  updateTask: async (id: number, updatedTask: UpdateTaskData) => {
    const response = await api.put<Task>(`/tasks/${id}`, updatedTask);
    return response.data;
  },

  deleteTask: async (id: number) => {
    await api.delete(`/tasks/${id}`);
  },

  toggleTask: async (id: number) => {
    const response = await api.patch<Task>(`/tasks/${id}/toggle`);
    return response.data;
  },

  getTaskStats: async () => {
    const response = await api.get<TaskStats>("/tasks/stats");
    return response.data;
  }
};
