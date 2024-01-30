import "server-only";
import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();

export async function createUser(userData: any) {
  const user = await prisma.user.create({
    data: userData,
  });
  return user;
}

export async function createClient(clientData: {
  first_name: string;
  last_name: string;
  dateOfBirth: Date;
  sex: string;
  race: string;
  userId: number; // Adjusted to match the type in the schema
  contactInfo?: string;
  caseNumber?: string;
}) {
  const newClient = await prisma.client.create({
    data: {
      first_name: clientData.first_name,
      last_name: clientData.last_name,
      dateOfBirth: clientData.dateOfBirth,
      sex: clientData.sex,
      race: clientData.race,
      userId: clientData.userId,
      contactInfo: clientData.contactInfo,
      caseNumber: clientData.caseNumber,
    },
  });

  return newClient;
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
  // Start a transaction to perform multiple operations
  await prisma.$transaction(async (prisma) => {
    // Delete the related EmailAddress records
    await prisma.emailAddress.deleteMany({
      where: { userId: userId },
    });

    // Delete the User
    await prisma.user.delete({
      where: { userId: userId },
    });
  });

  console.log(`User ${userId} and related email addresses deleted`);
}
