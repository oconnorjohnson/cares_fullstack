import "server-only";
import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { sendReceiptEmail } from "@/server/actions/update/actions";
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
  if (!fundTypeData.userId || !fundTypeData.typeName) {
    throw new Error("UserId and Type Name are required.");
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

export async function createNewReceiptRecord(newReceiptRecord: {
  userId: string;
  url: string;
  requestId: number;
  fundId: number;
}) {
  if (
    !newReceiptRecord.userId ||
    !newReceiptRecord.url ||
    !newReceiptRecord.requestId ||
    !newReceiptRecord.fundId
  ) {
    throw new Error("UserId, URL, Request ID, and Fund ID are required.");
  }
  console.log("Creating new receipt record with data:", newReceiptRecord);
  try {
    const newReceipt = await prisma.receipt.create({
      data: newReceiptRecord,
    });
    console.log("New receipt record created successfully:", newReceipt);
    await prisma.request.update({
      where: {
        id: newReceiptRecord.requestId, // Assuming the request ID is directly related and stored as `id`
      },
      data: {
        hasReceipts: true, // Update this field name if your schema uses a different name
      },
    });
    revalidatePath("/dashboard");
    return newReceipt;
  } catch (error) {
    throw new Error(
      `Failed to create new receipt record: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
    );
  }
}

export async function createNewFundByRequestId(newFundData: {
  requestId: number;
  fundTypeId: number;
  amount: number;
}) {
  if (
    !newFundData.requestId ||
    !newFundData.fundTypeId ||
    !newFundData.amount
  ) {
    throw new Error("Request ID, Fund Type ID, and Amount are required.");
  }
  console.log("Creating new fund with data:", newFundData);
  try {
    const newFund = await prisma.fund.create({
      data: {
        ...newFundData,
        // Check if the fundTypeId is NOT equal to 11, then set needsReceipt to true
        needsReceipt: newFundData.fundTypeId !== 11,
      },
    });
    console.log("New fund created successfully:", newFund);
    return newFund;
  } catch (error) {
    console.error("Failed to create new fund:", error);
    throw new Error(
      `Failed to add new fund: ${error instanceof Error ? error.message : "Unknown error"}`,
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

export async function createPostScreen(
  postScreenData: PostScreenData,
  requestId: number,
) {
  const postScreen = await prisma.postScreenAnswers.create({
    data: {
      ...postScreenData,
      request: {
        connect: {
          id: requestId,
        },
      },
    },
  });
  if (postScreen) {
    await prisma.request.update({
      where: {
        id: requestId,
      },
      data: {
        hasPostScreen: true,
      },
    });
  }
  return postScreen;
}

export async function createUser(userData: any) {
  console.log("Attempting to create user with data:", JSON.stringify(userData));

  // Check if user already exists to avoid unique constraint error
  const existingUser = await prisma.user.findUnique({
    where: { userId: userData.userId },
  });

  if (existingUser) {
    console.log(
      `User with userId ${userData.userId} already exists. Skipping creation.`,
    );
    return existingUser; // Return existing user to avoid error and continue flow
  }

  try {
    const user = await prisma.user.create({
      data: userData,
    });
    console.log(`User created successfully with ID: ${user.id}`);
    return user;
  } catch (error) {
    console.error("Failed to create user:", error);
    throw new Error(
      `Failed to create user: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
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
  // fetch all fundtype records and store in map
  const fundTypes = await prisma.fundType.findMany();
  const fundTypeMap = fundTypes.reduce(
    (
      acc: { [key: number]: string },
      fundType: { id: number; typeName: string },
    ) => {
      acc[fundType.id] = fundType.typeName;
      return acc;
    },
    {},
  );
  // process funds with conditional needsReceipt bool
  const processedFunds = requestData.funds.map((fund) => {
    const needsReceipt = !(
      fundTypeMap[fund.fundTypeId] === "Bus Pass" ||
      fundTypeMap[fund.fundTypeId] === "Walmart Gift Card" ||
      fundTypeMap[fund.fundTypeId] === "Arco Gift Card"
    );
    return {
      ...fund,
      needsReceipt,
    };
  });
  // do any funds need a receipt? if so set needsReceipts bool on request model to true
  const anyFundsNeedReceipt = processedFunds.some((fund) => fund.needsReceipt);
  // create request with processed funds
  const newRequest = await prisma.request.create({
    data: {
      clientId: requestData.clientId,
      userId: requestData.userId,
      agencyId: requestData.agencyId,
      details: requestData.details,
      implementation: requestData.implementation,
      sustainability: requestData.sustainability,
      pendingApproval: true,
      needsReceipts: anyFundsNeedReceipt,
      funds: {
        create: processedFunds,
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
  sex: string;
  race: string;
  userId: string;
  clientId: string;
}) {
  const newClient = await prisma.client.create({
    data: {
      sex: clientData.sex,
      race: clientData.race,
      userId: clientData.userId,
      clientId: clientData.clientId,
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

export async function addAgreementToRequest(
  requestId: number,
  agreementUrl: string,
) {
  const request = await prisma.request.findUnique({
    where: { id: requestId },
  });
  if (!request) {
    throw new Error(`Request with ID ${requestId} not found`);
  }
  const updatedRequest = await prisma.request.update({
    where: { id: requestId },
    data: {
      agreementUrl: agreementUrl,
    },
  });
  revalidatePath(`/dashboard`);
  revalidatePath(`/user/requests`);
  return updatedRequest;
}

export async function banUserById(userId: string) {
  const bannedUser = await prisma.user.update({
    where: { userId: userId },
    data: {
      isBanned: true,
    },
  });
  return bannedUser;
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

export async function markRequestPaidById(requestId: number) {
  const markedPaidRequest = await prisma.request.update({
    where: { id: requestId },
    data: {
      paid: true,
      approved: true,
      pendingPayout: false,
    },
  });
  return markedPaidRequest;
}

export async function denyRequestById(requestId: number) {
  const deniedRequest = await prisma.request.update({
    where: { id: requestId },
    data: {
      denied: true,
      approved: false,
      pendingApproval: false,
      pendingPayout: true,
      paid: false,
    },
  });
  return deniedRequest;
}

export async function approveRequestById(requestId: number) {
  const request = await prisma.request.findUnique({
    where: { id: requestId },
  });

  if (!request) {
    throw new Error(`Request with ID: ${requestId} not found.`);
  } else if (!request.hasPreScreen) {
    throw new Error(
      `Request with ID: ${requestId} cannot be approved without a complete pre-screen questionnaire.`,
    );
  }

  const approvedRequest = await prisma.request.update({
    where: { id: requestId },
    data: {
      approved: true,
      pendingApproval: false,
      denied: false,
      pendingPayout: true,
    },
  });
  return approvedRequest;
}

// DELETE FUNCTIONS
export async function deleteUser(userId: string) {
  // Delete related PreScreenAnswers and PostScreenAnswers
  const requests = await prisma.request.findMany({
    where: { userId: userId },
    select: { id: true },
  });
  for (const request of requests) {
    await prisma.sDOH.deleteMany({
      where: { requestId: request.id },
    });

    // Delete related RFF records for the request
    await prisma.rFF.deleteMany({
      where: { requestId: request.id },
    });
    await prisma.preScreenAnswers.deleteMany({
      where: { requestId: request.id },
    });
    await prisma.postScreenAnswers.deleteMany({
      where: { requestId: request.id },
    });
    // Delete related Funds and their Receipts
    const funds = await prisma.fund.findMany({
      where: { requestId: request.id },
      select: { id: true },
    });
    for (const fund of funds) {
      await prisma.receipt.deleteMany({
        where: { fundId: fund.id },
      });
      await prisma.fund.delete({
        where: { id: fund.id },
      });
    }
    // Delete the Request itself
    await prisma.request.delete({
      where: { id: request.id },
    });
  }
  // Delete related Clients
  await prisma.client.deleteMany({
    where: { userId: userId },
  });
  // Finally, delete the User
  await prisma.emailAddress.deleteMany({
    where: { userId: userId },
  });
  const deletedUser = await prisma.user.delete({
    where: { userId: userId },
  });
  console.log(`User ${userId} and all related data deleted`);
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
export async function getAgencyNameById(agencyId: number) {
  const agency = await prisma.agency.findUnique({
    where: {
      id: agencyId,
    },
    select: {
      name: true,
    },
  });
  return agency;
}

export async function getRequestsThatNeedAgreementsByUserId(userId: string) {
  const requests = await prisma.request.findMany({
    where: {
      userId: userId,
      agreementUrl: null,
      hasPreScreen: true,
      paid: true,
    },
    select: {
      id: true,
      userId: true,
      client: {
        select: {
          id: true,
          clientId: true,
        },
      },
      agency: {
        select: {
          id: true,
          name: true,
        },
      },
      createdAt: true,
    },
  });
  return requests;
}

export async function getUserIdAndEmailByRequestId(requestId: number) {
  const user = await prisma.request.findUnique({
    where: { id: requestId },
    select: {
      userId: true,
      user: {
        select: {
          first_name: true,
          emailAddresses: true,
        },
      },
    },
  });
  return user;
}

export async function getUserIdAndEmailByUserId(userId: string) {
  const user = await prisma.user.findUnique({
    where: { userId: userId },
    select: {
      first_name: true,
      emailAddresses: true,
    },
  });
  return user;
}

export async function getFundsThatNeedReceiptsByRequestId(requestId: number) {
  const funds = await prisma.fund.findMany({
    where: {
      requestId: requestId,
      needsReceipt: true,
    },
    select: {
      id: true,
      requestId: true,
      amount: true,
      fundType: {
        select: {
          id: true,
          typeName: true,
        },
      },
    },
  });
  return funds;
}

export async function getFundTypes() {
  const fundTypes = await prisma.fundType.findMany();
  return fundTypes;
}

export async function getFunds() {
  const funds = await prisma.fund.findMany({
    where: {
      request: {
        paid: true,
      },
    },
    select: {
      amount: true,
      request: {
        select: {
          id: true,
        },
      },
      fundType: {
        select: {
          typeName: true,
        },
      },
    },
  });
  return funds;
}

export async function getAllAgencies() {
  const agencies = await prisma.agency.findMany();
  return agencies;
}

export async function getUsers() {
  const users = await prisma.user.findMany({
    include: {
      emailAddresses: true, // Include all email addresses
      clients: {
        select: {
          first_name: true,
          last_name: true,
        },
      },
      requests: {
        select: {
          pendingApproval: true,
          approved: true,
          denied: true,
        },
      },
    },
  });
  return users;
}

export async function getClientsByUserId(userId: string) {
  const clients = await prisma.client.findMany({
    where: {
      userId: userId,
    },
    select: {
      id: true,
      clientId: true,
      race: true,
      sex: true,
    },
  });
  return clients;
}

export async function getClientByClientId(clientId: number) {
  const client = await prisma.client.findUnique({
    where: {
      id: clientId,
    },
  });
  return client;
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
          race: true,
          sex: true,
          clientId: true,
        },
      },
      user: {
        select: {
          id: true,
          userId: true,
          first_name: true,
          last_name: true,
          emailAddresses: {
            select: {
              email: true,
              id: true,
            },
          },
          isBanned: true,
        },
      },
      agency: true,
      details: true,
      pendingApproval: true,
      agreementUrl: true,
      approved: true,
      denied: true,
      pendingPayout: true,
      paid: true,
      implementation: true,
      sustainability: true,
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
          userId: true,
        },
      },
      user: {
        select: {
          id: true,
          userId: true,
          first_name: true,
          last_name: true,
          // Include emailAddresses in the selection
          emailAddresses: {
            select: {
              email: true,
              id: true,
            },
          },
          isBanned: true,
        },
      },
      agreementUrl: true,
      agency: true,
      details: true,
      pendingApproval: true,
      approved: true,
      denied: true,
      pendingPayout: true,
      implementation: true,
      sustainability: true,
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
          Receipt: {
            select: {
              id: true,
              url: true,
            },
          },
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
      client: {
        select: {
          id: true,
          race: true,
          sex: true,
          clientId: true,
        },
      },
      user: true,
      agency: true,
      preScreenAnswer: true,
      postScreenAnswer: true,
      funds: {
        include: {
          fundType: true,
          Receipt: true,
        },
      },
      SDOHs: true,
      RFFs: true,
    },
  });

  // Transform the structure of each request to match the RequestData type
  const transformedRequests = requests.map((request) => ({
    ...request,
    funds: request.funds.map((fund) => ({
      ...fund,
      // Since Receipt is now a one-to-one relationship, check directly if it exists
      Receipt: fund.Receipt
        ? {
            id: fund.Receipt.id,
            url: fund.Receipt.url,
          }
        : undefined,
    })),
  }));

  return transformedRequests;
}

export async function getRequestsNeedingPreScreenByUserId(userId: string) {
  const requests = await prisma.request.findMany({
    where: {
      userId: userId,
      hasPreScreen: false,
    },
    include: {
      client: true,
      user: true,
      agency: true,
    },
  });
  return requests;
}

export async function getRequestsNeedingReceiptsByUserId(userId: string) {
  const requests = await prisma.request.findMany({
    where: {
      userId: userId,
      hasPreScreen: true,
      paid: true,
      needsReceipts: true,
      hasReceipts: false,
    },
    include: {
      client: true,
      user: true,
      agency: true,
    },
  });
  return requests;
}

export async function getRequestsNeedingPostScreenByUserId(userId: string) {
  const requests = await prisma.request.findMany({
    where: {
      userId: userId,
      hasPreScreen: true,
      paid: true,
      AND: [
        {
          OR: [
            {
              needsReceipts: false,
            },
            {
              needsReceipts: true,
              hasReceipts: true,
            },
          ],
        },
        {
          hasPostScreen: false,
        },
      ],
    },
    include: {
      client: true,
      user: true,
      agency: true,
    },
  });
  return requests;
}

// COUNT FUNCTIONS
export async function countPendingRequests() {
  const requestsCount = await prisma.request.count({
    where: {
      pendingApproval: true,
    },
  });
  return requestsCount;
}

export async function countCompletedRequests() {
  const requestsCount = await prisma.request.count({
    where: {
      approved: true,
      paid: true,
    },
  });
  return requestsCount;
}

export async function countClientsByUserId(userId: string) {
  const clientsCount = await prisma.client.count({
    where: {
      userId: userId,
    },
  });
  return clientsCount;
}

export async function countDeniedRequests() {
  const requestsCount = await prisma.request.count({
    where: {
      denied: true,
    },
  });
  return requestsCount;
}

export async function countRequestsByAgency() {
  const requestsCountByAgency = await prisma.request.groupBy({
    by: ["agencyId"],
    _count: {
      id: true,
    },
  });

  return requestsCountByAgency.map(({ agencyId, _count }) => ({
    agencyId,
    requestCount: _count.id,
  }));
}

export async function countOpenRequestsByUserId(userId: string) {
  const requestsCount = await prisma.request.count({
    where: {
      userId: userId,
      pendingApproval: true,
    },
  });
  return requestsCount;
}

export async function countApprovedRequestsByUserId(userId: string) {
  const requestsCount = await prisma.request.count({
    where: {
      userId: userId,
      approved: true,
    },
  });
  return requestsCount;
}

export async function countDeniedRequestsByUserId(userId: string) {
  const requestsCount = await prisma.request.count({
    where: {
      userId: userId,
      denied: true,
    },
  });
  return requestsCount;
}
