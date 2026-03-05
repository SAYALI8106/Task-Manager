import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import pg from "pg";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
  log: ["query", "error", "warn"],
  adapter
});

process.on("beforeExit", async () => {
  await prisma.$disconnect();
});

export default prisma;
