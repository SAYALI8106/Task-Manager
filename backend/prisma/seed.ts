import prisma from "../src/config/prisma";
import { hashPassword } from "../src/utils";

const seedDatabase = async () => {
  console.log("Seeding database...");

  await prisma.task.deleteMany();
  console.log("Cleared existing tasks");

  await prisma.user.deleteMany();
  console.log("Cleared existing users");

  const seedPassword = "password123";
  const hashedPassword = await hashPassword(seedPassword);

  const user1 = await prisma.user.create({
    data: {
      email: "sam@example.com",
      name: "Sam Smith",
      password: hashedPassword
    }
  });
  console.log(`Created user: ${user1.email} with password ${seedPassword}`);

  const user1Tasks = await prisma.task.createMany({
    data: [
      {
        name: "Learn Prisma ORM",
        priority: "high",
        done: false,
        userId: user1.id
      },
      {
        name: "Build REST API",
        priority: "medium",
        done: false,
        userId: user1.id
      },
      {
        name: "Setup PostgreSQL",
        priority: "high",
        done: true,
        userId: user1.id
      }
    ]
  });
  console.log(`Created ${user1Tasks.count} tasks for ${user1.email}`);

  const user2 = await prisma.user.create({
    data: {
      email: "john@example.com",
      name: "John Doe",
      password: hashedPassword
    }
  });
  console.log(`Created user: ${user2.email} with password ${seedPassword}`);

  const user2Tasks = await prisma.task.createMany({
    data: [
      {
        name: "Deploy to production",
        priority: "high",
        done: false,
        userId: user2.id
      },
      {
        name: "Write documentation",
        priority: "low",
        done: false,
        userId: user2.id
      }
    ]
  });
  console.log(`Created ${user2Tasks.count} tasks for ${user2.email}`);

  console.log("Seeding completed!");
};

if (process.env.NODE_ENV !== "development") {
  console.error("Seed script should be only run in development environment");
  process.exit(1);
}

seedDatabase()
  .catch((e) => {
    console.error("Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => await prisma.$disconnect());
