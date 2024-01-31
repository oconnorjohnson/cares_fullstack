import "server-only";
import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();

// CREATE FUNCTIONS
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
  userId: string;
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

// UPDATE FUNCTIONS
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
  const updatedUser = await prisma.user.update({
    where: { userId: userId },
    data: {
      ...rest,
      emailAddresses: {
        upsert: emailAddresses.map(
          (emailAddress: { email: string; id: string }) => ({
            where: { email: emailAddress.email },
            update: { email: emailAddress.email },
            create: {
              email: emailAddress.email,
              user: { connect: { id: existingUser.id } },
            },
          }),
        ),
      },
    },
  });
  return updatedUser;
}

// DELETE FUNCTIONS
export async function deleteUser(userId: string) {
  // Delete the related EmailAddress records
  await prisma.emailAddress.deleteMany({
    where: { userId: userId },
  });

  // Then, delete the User
  const deletedUser = await prisma.user.delete({
    where: { userId: userId },
  });

  console.log(`User ${userId} and related email addresses deleted`);
  return deletedUser;
}

export async function deleteClient(clientId: number) {
  const deletedClient = await prisma.client.delete({
    where: { id: clientId },
  });

  console.log(`Client ${clientId} deleted`);
}

// GET FUNCTIONS
export async function getClientsByUserId(userId: string) {
  const clients = await prisma.client.findMany({
    where: {
      userId: userId,
    },
  });
  return clients;
}
