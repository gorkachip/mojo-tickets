import { PrismaClient } from "@prisma/client";
import bcryptjs from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const password = await bcryptjs.hash("mojo2024", 10);

  await prisma.user.upsert({
    where: { email: "gorka@mojodevelopments.com" },
    update: {},
    create: {
      name: "Gorka",
      email: "gorka@mojodevelopments.com",
      password,
      role: "admin",
    },
  });

  await prisma.user.upsert({
    where: { email: "jorge@mojodevelopments.com" },
    update: {},
    create: {
      name: "Jorge",
      email: "jorge@mojodevelopments.com",
      password,
      role: "admin",
    },
  });

  console.log("Seeded admin users: Gorka & Jorge");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
