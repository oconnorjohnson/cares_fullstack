"use server";

import {
  getClientsByUserId,
  getAdminRequests,
  getRequestsByUserId,
  getRequestById,
  getAllRequests,
} from "@/prisma/prismaFunctions";

export interface RequestData {
  id: number;
  user: {
    id: number;
    userId: string;
    first_name: string;
    last_name: string;
    isBanned: boolean;
  };
  details: string;
  agency: { id: number; name: string; userId: string };
  client: {
    id: number;
    first_name: string;
    last_name: string;
  };
  pendingApproval: boolean;
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
    amount: number;
  }[];
  SDOHs: {
    value: string;
  }[];
  RFFs: {
    value: string;
  }[];
}

export async function requestAllRequests(): Promise<RequestData[]> {
  try {
    const allRequestRecords: RequestData[] = await getAllRequests();
    return allRequestRecords;
  } catch (error) {
    console.error("Failed to call getAllRequests from prismaFunctions:", error);
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
    // Assuming the structure returned by getRequestById matches RequestData interface
    return request as RequestData;
  } catch (error) {
    console.error("Failed to retrieve request by ID:", error);
    throw error;
  }
}
