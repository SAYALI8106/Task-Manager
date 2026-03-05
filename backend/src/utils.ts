import z from "zod";
import bcrypt from "bcryptjs";

const DEFAULT_SALT = 10;

export const fetchEnvVar = (varName: string) => {
  const value = process.env[varName];
  if (!value) {
    throw new Error(`Missing ${varName} environment variable`);
  }

  return value;
};

export const getErrorMessage = (errors: z.ZodError["issues"]) => {
  const sortedErrors = errors.sort((a, b) =>
    a.path.join(".").localeCompare(b.path.join("."))
  );
  return sortedErrors[0].message;
};

export const hashPassword = async (
  password: string,
  salt: number | string = DEFAULT_SALT
) => await bcrypt.hash(password, salt);
