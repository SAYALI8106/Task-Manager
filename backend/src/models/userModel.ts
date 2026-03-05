import bcrypt from "bcryptjs";
import { RegistrationPayload, User } from "../types";
import { hashPassword } from "../utils";
import prisma from "../config/prisma";

export const createUser = async (
  userData: RegistrationPayload
): Promise<User> => {
  const hashedPassword = await hashPassword(userData.password);

  const user = await prisma.user.create({
    data: {
      name: userData.name,
      email: userData.email,
      password: hashedPassword
    }
  });

  return user;
};

export const findUserByEmail = async (email: string): Promise<User | null> =>
  await prisma.user.findUnique({ where: { email } });

export const findUserById = async (id: number) =>
  await prisma.user.findUnique({
    where: { id },
    omit: {
      password: true
    }
  });

export const verifyPassword = async (
  plainPassword: string,
  hashedPassword: string
) => await bcrypt.compare(plainPassword, hashedPassword);
