import { createClient as createSupabaseClient } from "@/server/supabase/server";
import { TablesInsert, TablesUpdate } from "@/types_db";

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

export async function updateFundById(fundData: TablesUpdate<"Fund">) {
  console.log(fundData.id);
  const supabase = createSupabaseClient();
  if (!fundData.id) {
    console.log("fundData.id is undefined");
    throw new Error("Fund ID is required.");
  }
  try {
    const { data, error } = await supabase
      .from("Fund")
      .update({
        amount: fundData.amount,
        fundTypeId: fundData.fundTypeId,
        needsReceipt: fundData.needsReceipt,
      })
      .eq("id", fundData.id);
    if (error) {
      console.log("Error in updateFundById:", error);
      throw error;
    }
    console.log("Fund updated successfully");
    return data;
  } catch (error) {
    console.log("Error in updateFundById:", error);
    throw error;
  }
}
export async function markRequestPaidById(requestId: number) {
  const supabase = createSupabaseClient();
  try {
    const { data: paidRequestData, error: paidRequestError } = await supabase
      .from("Request")
      .update({ paid: true })
      .eq("id", requestId);
    if (paidRequestError) throw paidRequestError;
    const { data: updatedFundData, error: updatedFundError } = await supabase
      .from("Fund")
      .update({ paid: true })
      .eq("requestId", requestId);
    if (updatedFundError) throw updatedFundError;
    return { paidRequestData, updatedFundData };
  } catch (error) {
    console.error("Error in markRequestPaidById:", error);
    throw error;
  }
}

export async function denyRequestById(requestId: number) {
  const supabase = createSupabaseClient();
  try {
    const deniedRequest = await supabase
      .from("Request")
      .update({ denied: true, approved: false, pendingApproval: false })
      .eq("id", requestId);
    return deniedRequest;
  } catch (error) {
    throw error;
  }
}

export async function approveRequestById(requestId: number) {
  console.log("Attempting to approve request with ID:", requestId);
  const supabase = createSupabaseClient();
  try {
    const { data, error } = await supabase
      .from("Request")
      .update({ approved: true, pendingApproval: false })
      .eq("id", requestId);
    if (error) {
      console.log("Error in approveRequestById:", error);
      throw error;
    }
    return data;
  } catch (error) {
    console.error("Error in approveRequestById:", error);
    throw error;
  }
}

export async function requestNeedsReceipt(requestId: number) {
  const supabase = createSupabaseClient();
  try {
    const { data, error } = await supabase
      .from("Request")
      .update({ needsReceipts: true })
      .eq("id", requestId);
    if (error) {
      console.log("Error in requestNeedsReceipt:", error);
      throw error;
    }
    return data;
  } catch (error) {
    console.error("Error requesting needs receipt:", error);
    throw error;
  }
}

export async function requestDoesNotNeedReceipt(requestId: number) {
  const supabase = createSupabaseClient();
  try {
    const { data, error } = await supabase
      .from("Request")
      .update({ needsReceipts: false })
      .eq("id", requestId);
    if (error) {
      console.log("Error in requestDoesNotNeedReceipt:", error);
      throw error;
    }
    return data;
  } catch (error) {
    console.error("Error requesting does not need receipt:", error);
    throw error;
  }
}
