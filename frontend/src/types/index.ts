export type Priority = "low" | "medium" | "high";

export type Task = {
  id: number;
  name: string;
  priority: Priority;
  done: boolean;
  createdAt?: string;
  updatedAt?: string;
  userId: number;
};

export type User = {
  id: number;
  email: string;
  name: string;
  createdAt?: string;
  updatedAt?: string;
};

export type RegistrationData = {
  email: string;
  password: string;
  name: string;
};

export type LoginData = {
  email: string;
  password: string;
};

export type FilterValue = "active" | "done" | "all";
