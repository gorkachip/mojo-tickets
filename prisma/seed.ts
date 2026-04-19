import { PrismaClient } from "@prisma/client";
import bcryptjs from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const password = await bcryptjs.hash("mojo1995", 10);

  await prisma.user.upsert({
    where: { username: "gorka" },
    update: { password },
    create: {
      name: "Gorka",
      username: "gorka",
      password,
      role: "admin",
    },
  });

  await prisma.user.upsert({
    where: { username: "jorge" },
    update: { password },
    create: {
      name: "Jorge",
      username: "jorge",
      password,
      role: "admin",
    },
  });

  await prisma.user.upsert({
    where: { username: "shane" },
    update: { password },
    create: {
      name: "Shane",
      username: "shane",
      password,
      role: "admin",
    },
  });

  console.log("Seeded admin users: Gorka, Jorge & Shane");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
