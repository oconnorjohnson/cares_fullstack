"use server";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function createUser(userData: any) {
  const user = await prisma.user.create({
    data: userData,
  });
  return user;
}

export async function updateUser(userId: string, userData: any) {
  const user = await prisma.user.update({
    where: { userId: userId },
    data: userData,
  });
  return user;
}

export async function deleteUser(userId: string) {
  const user = await prisma.user.delete({
    where: { userId: userId },
  });
  return user;
}
