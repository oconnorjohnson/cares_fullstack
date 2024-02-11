"use server";

import { denyRequestById, approveRequestById } from "@/prisma/prismaFunctions";
import { revalidatePath } from "next/cache";

export interface RequestData {
  id: number;
  details: string;
  pendingApproval: boolean;
  approved: boolean;
  denied: boolean;
  pendingPayout: boolean;
  paid: boolean;
  hasPreScreen: boolean;
  hasPostScreen: boolean;
  createdAt: Date;
}

export async function DenyRequest(requestId: number): Promise<RequestData> {
  try {
    const updatedRequest = await denyRequestById(requestId);
    await revalidatePath(`/admin/request/${requestId}/page`);
    return updatedRequest;
  } catch (error) {
    console.error(`Failed to deny request with ID ${requestId}:`, error);
    throw error;
  }
}

export async function ApproveRequest(requestId: number): Promise<RequestData> {
  try {
    const updatedRequest = await approveRequestById(requestId);
    await revalidatePath(`/admin/request/${requestId}/page`);
    return updatedRequest;
  } catch (error) {
    console.error(`Failed to approve request with ID ${requestId}:`, error);
    throw error;
  }
}
