import api from "./api";
import { LoginData, RegistrationData, User } from "../types";

export const authService = {
  register: async (data: RegistrationData) => {
    const response = await api.post<{ user: User }>("/auth/register", data);
    return response.data;
  },

  login: async (data: LoginData) => {
    const response = await api.post<{ user: User }>("/auth/login", data);
    return response.data;
  },

  logout: async () => await api.post("/auth/logout"),

  getCurrentUser: async () => {
    const response = await api.get<{ user: User }>("/auth/profile");
    return response.data;
  }
};
