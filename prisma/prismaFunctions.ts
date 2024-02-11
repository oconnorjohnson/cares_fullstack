import "server-only";
import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();

// TYPES
interface PreScreenData {
  housingSituation: number;
  housingQuality: number;
  utilityStress: number;
  foodInsecurityStress: number;
  foodMoneyStress: number;
  transpoConfidence: number;
  transpoStress: number;
  financialDifficulties: number;
  additionalInformation: string;
}

interface PostScreenData {
  housingSituation: number;
  housingQuality: number;
  utilityStress: number;
  foodInsecurityStress: number;
  foodMoneyStress: number;
  transpoConfidence: number;
  transpoStress: number;
  financialDifficulties: number;
  additionalInformation: string;
}

// CREATE FUNCTIONS
export async function createFundType(fundTypeData: {
  userId: string;
  typeName: string;
}) {
  if (!fundTypeData.userId) {
    throw new Error("UserId is required.");
  }
  if (!fundTypeData.typeName) {
    throw new Error("TypeName is required.");
  }
  try {
    const fundType = await prisma.fundType.create({
      data: fundTypeData,
    });
    return fundType;
  } catch (error) {
    throw new Error(
      `Failed to create fund type: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
}

export async function createPreScreen(
  preScreenData: PreScreenData,
  requestId: number,
) {
  const preScreen = await prisma.preScreenAnswers.create({
    data: {
      ...preScreenData,
      request: {
        connect: {
          id: requestId,
        },
      },
    },
  });
  if (preScreen) {
    await prisma.request.update({
      where: {
        id: requestId,
      },
      data: {
        hasPreScreen: true,
      },
    });
  }
  return preScreen;
}

export async function createUser(userData: any) {
  const user = await prisma.user.create({
    data: userData,
  });
  return user;
}

export async function createAgency(agencyData: {
  userId: string;
  name: string;
}) {
  const newAgency = await prisma.agency.create({
    data: {
      userId: agencyData.userId,
      name: agencyData.name,
    },
  });
  return newAgency;
}

export async function createRequest(requestData: {
  clientId: number;
  userId: string;
  agencyId: number;
  details: string;
  implementation: string;
  sustainability: string;
  funds: { fundTypeId: number; amount: number }[];
  sdoh: string[];
  rff: string[];
}) {
  const newRequest = await prisma.request.create({
    data: {
      clientId: requestData.clientId,
      userId: requestData.userId,
      agencyId: requestData.agencyId,
      details: requestData.details,
      implementation: requestData.implementation,
      sustainability: requestData.sustainability,
      pendingApproval: true,
      funds: {
        create: requestData.funds.map((fund) => ({
          fundTypeId: fund.fundTypeId,
          amount: fund.amount,
        })),
      },
      SDOHs: {
        create: requestData.sdoh.map((sdoh) => ({
          value: sdoh,
        })),
      },
      RFFs: {
        create: requestData.rff.map((rff) => ({
          value: rff,
        })),
      },
    },
  });
  return newRequest;
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
  const existingUser = await prisma.user.findUnique({
    where: { userId: userId },
  });
  if (!existingUser) {
    throw new Error(`User with userId ${userId} not found`);
  }
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

export async function updateFundById(
  fundId: number,
  amount: number,
  fundTypeId: number,
) {
  // First, check if the fundTypeId exists to prevent foreign key constraint errors
  const fundTypeExists = await prisma.fundType.findUnique({
    where: {
      id: fundTypeId,
    },
  });

  if (!fundTypeExists) {
    throw new Error(`FundType with ID: ${fundTypeId} does not exist.`);
  }

  // Proceed with the update if the fundType exists
  try {
    const updatedFund = await prisma.fund.update({
      where: {
        id: fundId,
      },
      data: {
        amount: amount,
        // Ensure the fundTypeId is correctly associated
        fundTypeId: fundTypeId,
      },
    });

    console.log("Updated fund:", updatedFund);
    return updatedFund;
  } catch (error) {
    console.error(`Failed to update fund with ID: ${fundId}`, error);
    throw new Error(`Failed to update fund with ID: ${fundId}`);
  }
}

export async function denyRequestById(requestId: number) {
  const deniedRequest = await prisma.request.update({
    where: { id: requestId },
    data: {
      denied: true,
      approved: false,
      pendingApproval: false,
    },
  });
  return deniedRequest;
}

export async function approveRequestById(requestId: number) {
  const approvedRequest = await prisma.request.update({
    where: { id: requestId },
    data: {
      denied: false,
      approved: true,
      pendingApproval: false,
    },
  });
  return approvedRequest;
}

// DELETE FUNCTIONS
export async function deleteUser(userId: string) {
  await prisma.emailAddress.deleteMany({
    where: { userId: userId },
  });
  const deletedUser = await prisma.user.delete({
    where: { userId: userId },
  });
  console.log(`User ${userId} and related email addresses deleted`);
  return deletedUser;
}

export async function deleteFundById(fundId: number) {
  const deletedFund = await prisma.fund.delete({
    where: {
      id: fundId,
    },
  });
  return deletedFund;
}

export async function deleteFundType(fundTypeId: number) {
  const dependentFundsCount = await prisma.fund.count({
    where: {
      fundTypeId: fundTypeId,
    },
  });
  if (dependentFundsCount > 0) {
    throw new Error(
      `FundType ${fundTypeId} cannot be deleted because they have dependent funds.`,
    );
  }
  const deletedFundType = await prisma.fundType.delete({
    where: { id: fundTypeId },
  });
  console.log(`Deleted fundType with ID: ${fundTypeId}`);
  return deletedFundType;
}

export async function deleteClient(clientId: number) {
  const dependentRequestsCount = await prisma.request.count({
    where: {
      clientId: clientId,
    },
  });
  if (dependentRequestsCount > 0) {
    throw new Error(
      `Client ${clientId} cannot be deleted because they have dependent requests.`,
    );
  }
  const deletedClient = await prisma.client.delete({
    where: { id: clientId },
  });
  console.log(`Client ${clientId} deleted`);
  return deletedClient;
}

export async function deleteAgency(agencyId: number) {
  const dependentRequestsCount = await prisma.request.count({
    where: {
      agencyId: agencyId,
    },
  });
  if (dependentRequestsCount > 0) {
    throw new Error(
      `Agency ${agencyId} cannot be deleted because it has dependent requests.`,
    );
  }
  const deletedAgency = await prisma.agency.delete({
    where: { id: agencyId },
  });
  console.log(`Agency ${agencyId} deleted`);
  return deletedAgency;
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

export async function getAdminRequests(filter: string, userId?: string) {
  let whereClause = {};

  if (filter === "pendingApproval") {
    whereClause = { pendingApproval: true };
  } else if (filter === "approved") {
    whereClause = { pendingApproval: false };
  } else if (filter === "byUser" && userId) {
    whereClause = { userId: userId };
  }

  const requests = await prisma.request.findMany({
    where: whereClause,
    include: {
      client: true,
      agency: true,
      funds: {
        include: {
          fundType: true,
        },
      },
      SDOHs: true,
      RFFs: true,
    },
  });
  return requests;
}

export async function getAllRequests() {
  const requests = await prisma.request.findMany({
    select: {
      id: true,
      userId: true,
      client: {
        select: {
          id: true,
          first_name: true,
          last_name: true,
        },
      },
      user: true,
      agency: true,
      details: true,
      pendingApproval: true,
      approved: true,
      denied: true,
      pendingPayout: true,
      paid: true,
      hasPreScreen: true,
      preScreenAnswer: {
        select: {
          id: true,
          housingSituation: true,
          housingQuality: true,
          utilityStress: true,
          foodInsecurityStress: true,
          foodMoneyStress: true,
          transpoConfidence: true,
          transpoStress: true,
          financialDifficulties: true,
          additionalInformation: true,
          createdAt: true,
        },
      },
      hasPostScreen: true,
      postScreenAnswer: {
        select: {
          id: true,
          housingSituation: true,
          housingQuality: true,
          utilityStress: true,
          foodInsecurityStress: true,
          foodMoneyStress: true,
          transpoConfidence: true,
          transpoStress: true,
          financialDifficulties: true,
          additionalInformation: true,
          createdAt: true,
        },
      },
      createdAt: true,
      funds: {
        select: {
          id: true,
          fundType: {
            select: {
              id: true,
              typeName: true,
            },
          },
          amount: true,
        },
      },
      SDOHs: {
        select: {
          value: true,
        },
      },
      RFFs: {
        select: {
          value: true,
        },
      },
    },
  });
  return requests;
}

export async function getRequestById(requestId: number) {
  const request = await prisma.request.findUnique({
    where: {
      id: requestId,
    },
    select: {
      id: true,
      userId: true,
      client: {
        select: {
          id: true,
          first_name: true,
          last_name: true,
        },
      },
      user: true,
      agency: true,
      details: true,
      pendingApproval: true,
      approved: true,
      denied: true,
      pendingPayout: true,
      paid: true,
      hasPreScreen: true,
      preScreenAnswer: {
        select: {
          id: true,
          housingSituation: true,
          housingQuality: true,
          utilityStress: true,
          foodInsecurityStress: true,
          foodMoneyStress: true,
          transpoConfidence: true,
          transpoStress: true,
          financialDifficulties: true,
          additionalInformation: true,
          createdAt: true,
        },
      },
      hasPostScreen: true,
      postScreenAnswer: {
        select: {
          id: true,
          housingSituation: true,
          housingQuality: true,
          utilityStress: true,
          foodInsecurityStress: true,
          foodMoneyStress: true,
          transpoConfidence: true,
          transpoStress: true,
          financialDifficulties: true,
          additionalInformation: true,
          createdAt: true,
        },
      },
      createdAt: true,
      funds: {
        select: {
          id: true,
          fundType: {
            select: {
              id: true,
              typeName: true,
            },
          },
          amount: true,
        },
      },
      SDOHs: {
        select: {
          value: true,
        },
      },
      RFFs: {
        select: {
          value: true,
        },
      },
    },
  });
  return request;
}

export async function getRequestsByUserId(userId: string) {
  const requests = await prisma.request.findMany({
    where: {
      userId: userId,
    },
    include: {
      client: true,
      user: true,
      agency: true,
      funds: {
        include: {
          fundType: true,
        },
      },
      SDOHs: true,
      RFFs: true,
    },
  });
  return requests;
}
