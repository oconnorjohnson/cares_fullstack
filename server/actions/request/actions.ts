"use server";

import {
  getClientsByUserId,
  getAdminRequests,
  getRequestById,
  getAllRequests,
  getRequestsByUserId,
  getAgencyNameById,
} from "@/prisma/prismaFunctions";
import { revalidatePath } from "next/cache";

interface RequestData {
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
export async function requestUsersRequests(
  userId: string,
): Promise<RequestData[]> {
  try {
    const allUserRequestRecords: RequestData[] =
      await getRequestsByUserId(userId);
    return allUserRequestRecords;
  } catch (error) {
    console.error(
      "Failed to get call getRequestsByUserId from prismaFunctions:",
      error,
    );
    throw error;
  }
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
    return request as RequestData;
  } catch (error) {
    console.error("Failed to retrieve request by ID:", error);
    throw error;
  }
}

export async function AgencyById(agencyId: number) {
  const agencyName = await getAgencyNameById(agencyId);
  return agencyName;
}
