"use server";
import {
  deleteFundById,
  deleteAgencyById,
  deleteFundTypeById,
} from "@/server/supabase/functions/delete";
import { revalidatePath } from "next/cache";

export async function DeleteFund(fundId: number, requestId: number) {
  try {
    await deleteFundById(fundId);
    await revalidatePath(`/admin/request/${requestId}/page`);
  } catch (error) {
    console.error(`Failed to delete fund with id ${fundId}:`, error);
    throw error;
  }
}

export async function DeleteAgency(agencyId: number) {
  try {
    await deleteAgencyById(agencyId);
    await revalidatePath(`/admin/settings`);
  } catch (error) {
    console.error(`Failed to delete agency with id ${agencyId}:`, error);
    throw error;
  }
}

export async function DeleteFundType(fundTypeId: number) {
  try {
    await deleteFundTypeById(fundTypeId);
    await revalidatePath(`/admin/settings`);
  } catch (error) {
    console.error(`Failed to delete fund type with id ${fundTypeId}:`, error);
    throw error;
  }
}
