import "server-only";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function createUser(userData: any) {
  const user = await prisma.user.create({
    data: userData,
  });
  return user;
}

export async function updateUser(userId: string, userData: any) {
  const { emailAddresses, ...rest } = userData;

  // Find the user with the provided userId
  const existingUser = await prisma.user.findUnique({
    where: { userId: userId },
  });

  if (!existingUser) {
    throw new Error(`User with userId ${userId} not found`);
  }

  // Start a transaction if you need to perform multiple independent operations
  const updatedUser = await prisma.$transaction(async (prisma) => {
    // Update the user's scalar fields
    const updatedUser = await prisma.user.update({
      where: { userId: userId },
      data: rest,
    });

    // Upsert email addresses and link them to the user
    if (emailAddresses) {
      await Promise.all(
        emailAddresses.map((emailAddress: { email: string; id: string }) =>
          prisma.emailAddress.upsert({
            where: { email: emailAddress.email },
            update: { email: emailAddress.email },
            create: {
              email: emailAddress.email,
              user: { connect: { id: existingUser.id } },
            },
          }),
        ),
      );
    }

    return updatedUser;
  });

  return updatedUser;
}
export async function deleteUser(userId: string) {
  await prisma.$transaction([
    prisma.emailAddress.deleteMany({
      where: { userId: userId },
    }),
    prisma.user.delete({
      where: { userId: userId },
    }),
  ]);
}
