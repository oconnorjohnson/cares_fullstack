"use server";

import {
  getClientsByUserId,
  getAdminRequests,
  getRequestById,
  getAllRequests,
  getRequestsByUserId,
  getAgencyNameById,
  getUsers,
  getFunds,
  getAllAgencies,
  getFundTypes,
  getRequestsNeedingPreScreenByUserId,
  getRequestsNeedingReceiptsByUserId,
  getRequestsNeedingPostScreenByUserId,
  getClientByClientId,
  getRequestsThatNeedAgreementsByUserId,
} from "@/server/supabase/functions/read";
import { Tables } from "@/types_db";

export type FundTypeData = {
  id: number;
  typeName: string;
  userId: string;
};
export type FundData = {
  amount: number;
  fundType: { typeName: string };
  request: { id: number };
};

export type RequestData = {
  id: number;
  user: {
    id: number;
    userId: string;
    emailAddresses?: {
      email: string;
      id: number;
    }[];
    first_name: string;
    last_name: string;
    isBanned: boolean;
  };
  details: string;
  agency: { id: number; name: string; userId: string };
  client: {
    id: number;
    clientId: string | null;
    race: string;
    sex: string;
  };
  pendingApproval: boolean;
  agreementUrl: string | null;
  implementation: string;
  sustainability: string | null;
  approved: boolean;
  denied: boolean;
  pendingPayout: boolean;
  paid: boolean;
  hasPreScreen: boolean;
  preScreenAnswer: {
    id: number;
    housingSituation: number;
    housingQuality: number;
    utilityStress: number;
    foodInsecurityStress: number;
    foodMoneyStress: number;
    transpoConfidence: number;
    transpoStress: number;
    financialDifficulties: number;
    additionalInformation: string;
    createdAt: Date;
  } | null;
  hasPostScreen: boolean;
  postScreenAnswer: {
    id: number;
    housingSituation: number;
    housingQuality: number;
    utilityStress: number;
    foodInsecurityStress: number;
    foodMoneyStress: number;
    transpoConfidence: number;
    transpoStress: number;
    financialDifficulties: number;
    additionalInformation: string;
    createdAt: Date;
  } | null;
  createdAt: Date;
  funds: {
    id: number;
    fundType: {
      id: number;
      typeName: string;
    };
    Receipt?: {
      id: number;
      url: string;
    };
    amount: number;
  }[];
  SDOHs: {
    value: string;
  }[];
  RFFs: {
    value: string;
  }[];
};

export async function giveUserIdGetRequestsNeedingPreScreen(userId: string) {
  const requests = await getRequestsNeedingPreScreenByUserId(userId);
  return requests;
}

export async function getClientById(clientId: number) {
  const client = await getClientByClientId(clientId);
  return client;
}

export async function giveUserIdGetRequestsNeedingReceipts(userId: string) {
  const requests = await getRequestsNeedingReceiptsByUserId(userId);
  return requests;
}

export async function giveUserIdGetRequestsNeedingAgreements(userId: string) {
  const requests = await getRequestsThatNeedAgreementsByUserId(userId);
  return requests;
}

export async function giveUserIdGetRequestsNeedingPostScreen(userId: string) {
  const requests = await getRequestsNeedingPostScreenByUserId(userId);
  return requests;
}

export async function requestUsersRequests(
  userId: string,
): Promise<Tables<"Request">[]> {
  try {
    const response = await getRequestsByUserId(userId);
    const requests = response.data;
    if (!requests) {
      throw new Error("Failed to fetch requests for user.");
    }
    return requests;
  } catch (error) {
    console.error(`Failed to fetch requests for user ${userId}:`, error);
    throw error;
  }
}

export async function requestUsersClients(userId: string) {
  try {
    const allUserClients = await getClientsByUserId(userId);
    return allUserClients;
  } catch (error) {
    console.error(
      "Failed to get call getClientsByUserId from prismaFunctions:",
      error,
    );
    throw error;
  }
}

export async function requestAllFundTypes(): Promise<Tables<"FundType">[]> {
  try {
    const response = await getFundTypes();
    const fundTypes = response.data;
    if (!fundTypes) {
      throw new Error("Failed to fetch fund types.");
    }
    return fundTypes;
  } catch (error) {
    console.error("Failed to call get Fund Types from prismaFunctions:", error);
    throw error;
  }
}

export async function requestAllRequests(): Promise<Tables<"Request">[]> {
  try {
    const response = await getAllRequests();
    const requests = response.data;
    if (!requests) {
      throw new Error("Failed to fetch requests.");
    }
    return requests;
  } catch (error) {
    console.error(`Failed to fetch requests:`, error);
    throw error;
  }
}

export async function getPaidFunds(): Promise<Tables<"Fund">[]> {
  try {
    const response = await getFunds();
    const paidFunds = response.data;
    if (!paidFunds) {
      throw new Error("Failed to fetch paid funds.");
    }
    return paidFunds;
  } catch (error) {
    console.error("Failed to get paid funds:", error);
    throw error;
  }
}

export async function requestRequestByRequestId(
  requestId: number,
): Promise<RequestData> {
  try {
    const request = await getRequestById(requestId);
    if (!request) {
      throw new Error(`Request with ID ${requestId} not found.`);
    }
    return request as unknown as RequestData;
  } catch (error) {
    console.error("Failed to retrieve request by ID:", error);
    throw error;
  }
}

export async function requestAllAgencies() {
  const agencies = await getAllAgencies();
  return agencies;
}

export async function AgencyById(agencyId: number) {
  const agencyName = await getAgencyNameById(agencyId);
  return agencyName;
}

export async function GetAllUsers() {
  const users = await getUsers();
  return users;
}
