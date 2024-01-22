import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function createUser(userData: any) {
  const user = await prisma.user.create({
    data: userData,
  });
  return user;
}
