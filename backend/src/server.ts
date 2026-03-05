import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth";
import tasksRouter from "./routes/tasks";
import { errorHandler } from "./middlewares/errorHandler";
import { requestLogger } from "./middlewares/logger";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./utils/swagger";
import { StatusCodes } from "http-status-codes";
import prisma from "./config/prisma";
import { fetchEnvVar } from "./utils";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

const ensureEnvVarIsSet = (varName: string) => {
  if (!process.env[varName]) {
    throw new Error(`Missing ${varName} environment variable`);
  }
};

for (const envVar of [
  "FRONTEND_APP_URL",
  "NODE_ENV",
  "DATABASE_URL",
  "JWT_SECRET"
]) {
  fetchEnvVar(envVar);
}
app.use(
  cors({
    origin: process.env.FRONTEND_APP_URL,
    credentials: true
  })
);

app.use(express.json());
app.use(cookieParser());
app.use(requestLogger);

app.get("/api/health", async (req: Request, res: Response) => {
  try {
    await prisma.$executeRaw`select 1`;

    res.json({
      status: "ok",
      database: "connected",
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    });
  } catch (e) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: "error",
      database: "disconnected",
      timestamp: new Date().toISOString()
    });
  }
});

app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api/auth", authRouter);
app.use("/api/tasks", tasksRouter);

app.use((req: Request, res: Response) => {
  res.status(StatusCodes.NOT_FOUND).json({
    message: "Route not found",
    path: req.path
  });
});

app.use(errorHandler);
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
