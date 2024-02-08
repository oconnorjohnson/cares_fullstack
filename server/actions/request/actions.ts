"use server";

import {
  getClientsByUserId,
  getAdminRequests,
  getRequestsByUserId,
  getAllRequests,
} from "@/prisma/prismaFunctions";

interface RequestData {
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
  pendingPayout: boolean;
  paid: boolean;
  hasPreScreen: boolean;
  hasPostScreen: boolean;
  createdAt: Date;
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
