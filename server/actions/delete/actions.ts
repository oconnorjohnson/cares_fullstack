"use server";
import {
  deleteFundById,
  deleteAgencyById,
  deleteFundTypeById,
} from "@/server/supabase/functions/delete";
import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs/server";

export async function DeleteFund(fundId: number, requestId: number) {
  const { userId: clerkuserId } = auth();
  if (!clerkuserId) {
    throw new Error("User not authenticated");
  }
  try {
    await deleteFundById(fundId);
    revalidatePath(`/admin/request/${requestId}/page`);
  } catch (error) {
    console.error(`Failed to delete fund with id ${fundId}:`, error);
    throw error;
  }
}

export async function DeleteAgency(agencyId: number) {
  const { userId: clerkuserId } = auth();
  if (!clerkuserId) {
    throw new Error("User not authenticated");
  }
  try {
    await deleteAgencyById(agencyId);
    revalidatePath(`/admin/settings`);
  } catch (error) {
    console.error(`Failed to delete agency with id ${agencyId}:`, error);
    throw error;
  }
}

export async function DeleteFundType(fundTypeId: number) {
  const { userId: clerkuserId } = auth();
  if (!clerkuserId) {
    throw new Error("User not authenticated");
  }
  try {
    await deleteFundTypeById(fundTypeId);
    revalidatePath(`/admin/settings`);
  } catch (error) {
    console.error(`Failed to delete fund type with id ${fundTypeId}:`, error);
    throw error;
  }
}
