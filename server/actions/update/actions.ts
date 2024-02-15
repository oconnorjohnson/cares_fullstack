"use server";

import {
  denyRequestById,
  approveRequestById,
  updateFundById,
  markRequestPaidById,
  banUserById,
} from "@/prisma/prismaFunctions";
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

export interface UserData {
  userId: string;
  isBanned: boolean;
}

export async function BanUser(userId: string): Promise<UserData> {
  try {
    const updatedUser = await banUserById(userId);
    await revalidatePath(`/dashboard/page`);
    return updatedUser;
  } catch (error) {
    console.error(`Failed to ban user with ID ${userId}:`, error);
    throw error;
  }
}

export async function DenyRequest(requestId: number): Promise<RequestData> {
  try {
    const updatedRequest = await denyRequestById(requestId);
    await revalidatePath(`/admin/request/${requestId}/page`);
    await revalidatePath(`/dashboard/page`);
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
    await revalidatePath(`/dashboard/page`);
    return updatedRequest;
  } catch (error) {
    console.error(`Failed to approve request with ID ${requestId}:`, error);
    throw error;
  }
}

export async function MarkPaid(requestId: number): Promise<RequestData> {
  try {
    const updatedRequest = await markRequestPaidById(requestId);
    await revalidatePath(`/admin/request/${requestId}/page`);
    await revalidatePath(`/dashboard/page`);
    return updatedRequest;
  } catch (error) {
    console.error(
      `Failed to mark request with ID ${requestId} as paid:`,
      error,
    );
    throw error;
  }
}

export async function UpdateFund(
  fundId: number,
  fundTypeId: number,
  amount: number,
  requestId: number,
) {
  console.log(
    `Calling UpdateFund with Fund ID: ${fundId}, Request ID: ${requestId}, Amount: ${amount}, Fund Type ID: ${fundTypeId}`,
  );
  console.log(
    `Before updateFundById - Fund ID: ${fundId}, Fund Type ID: ${fundTypeId}, Amount: ${amount}`,
  );
  await updateFundById(fundId, amount, fundTypeId);
  try {
    console.log(
      `Before updateFundById - Fund ID: ${fundId}, Fund Type ID: ${fundTypeId}, Amount: ${amount}`,
    );
    await updateFundById(fundId, amount, fundTypeId);
    console.log(`Successfully updated fund with ID: ${fundId}`);
    await revalidatePath(`/admin/request/${requestId}/page`);
  } catch (error) {
    console.error(`Failed to update fund with ID ${fundId}:`, error);
    throw error;
  }
}
