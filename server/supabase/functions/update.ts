import { createClient as createSupabaseClient } from "@/server/supabase/server";
import { TablesInsert, TablesUpdate } from "@/types_db";
import { join } from "path";

export async function updateUser(
  userId: string,
  userData: TablesInsert<"User">,
) {
  const supabase = createSupabaseClient();

  const { data, error } = await supabase
    .from("User")
    .update(userData)
    .eq("userId", userId);
  if (error) throw error;
  return data;
}

export async function addAgreementToRequest(
  requestId: number,
  agreementUrl: string,
) {
  const supabase = createSupabaseClient();
  try {
    const updatedRequest = await supabase
      .from("Request")
      .update({ agreementUrl })
      .eq("id", requestId);
    return updatedRequest;
  } catch (error) {
    throw error;
  }
}

export async function banUserById(userId: string) {
  const supabase = createSupabaseClient();
  try {
    const bannedUser = await supabase
      .from("User")
      .update({ isBanned: true })
      .eq("userId", userId);
    return bannedUser;
  } catch (error) {
    throw error;
  }
}

export async function updateFundById(fundData: TablesInsert<"Fund">) {
  const supabase = createSupabaseClient();
  if (!fundData.id) {
    throw new Error("Fund ID is required.");
  }
  try {
    const updatedFund = await supabase
      .from("Fund")
      .update(fundData)
      .eq("id", fundData.id);
    return updatedFund;
  } catch (error) {
    throw error;
  }
}

export async function markRequestPaidById(requestId: number) {
  const supabase = createSupabaseClient();
  try {
    const paidRequest = await supabase
      .from("Request")
      .update({ paid: true })
      .eq("id", requestId);
    return paidRequest;
  } catch (error) {
    throw error;
  }
}

export async function denyRequestById(requestId: number) {
  const supabase = createSupabaseClient();
  try {
    const deniedRequest = await supabase
      .from("Request")
      .update({ denied: true })
      .eq("id", requestId);
    return deniedRequest;
  } catch (error) {
    throw error;
  }
}

export async function approveRequestById(requestId: number) {
  const supabase = createSupabaseClient();
  try {
    const approvedRequest = await supabase
      .from("Request")
      .update({ approved: true })
      .eq("id", requestId);
    return approvedRequest;
  } catch (error) {
    throw error;
  }
}

export async function requestNeedsReceipt(requestId: number) {
  const supabase = createSupabaseClient();
  try {
    const requestNeedsReceipt = await supabase
      .from("Request")
      .update({ needsReceipts: true })
      .eq("id", requestId);
    return requestNeedsReceipt;
  } catch (error) {
    console.error("Error requesting needs receipt:", error);
    throw error;
  }
}