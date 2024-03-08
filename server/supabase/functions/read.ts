import { createClient as createSupabaseClient } from "@/server/supabase/server";
import { TablesInsert } from "@/types_db";

export async function getAgencyNameById(agencyId: number) {
  const supabase = createSupabaseClient();
  try {
    const agency = await supabase
      .from("Agency")
      .select("name")
      .eq("id", agencyId);
    return agency;
  } catch (error) {
    throw error;
  }
}

export async function getRequestsThatNeedAgreementsByUserId(userId: string) {
  const supabase = createSupabaseClient();
  try {
    const requests = await supabase
      .from("Request")
      .select("*")
      .eq("userId", userId)
      .is("agreementUrl", null);
    return requests;
  } catch (error) {
    throw error;
  }
}

export async function getRequestsNeedingPreScreenByUserId(userId: string) {
  const supabase = createSupabaseClient();
  try {
    const requests = await supabase
      .from("Request")
      .select("*")
      .eq("userId", userId)
      .eq("hasPreScreen", false);
    return requests;
  } catch (error) {
    throw error;
  }
}

export async function getClientById(clientId: number) {
  const supabase = createSupabaseClient();
  try {
    const client = await supabase.from("Client").select("*").eq("id", clientId);
    return client;
  } catch (error) {
    throw error;
  }
}

export async function getRequestsByUserId(userId: string) {
  const supabase = createSupabaseClient();
  try {
    const requests = await supabase
      .from("Request")
      .select("*")
      .eq("userId", userId);
    return requests;
  } catch (error) {
    throw error;
  }
}

export async function getFundsThatNeedReceiptsByRequestId(requestId: number) {
  const supabase = createSupabaseClient();
  try {
    const funds = await supabase
      .from("Fund")
      .select("*")
      .eq("requestId", requestId)
      .eq("needsReceipt", true);
    return funds;
  } catch (error) {
    throw error;
  }
}

export async function getUsers() {
  const supabase = createSupabaseClient();
  try {
    const users = await supabase.from("User").select("*");
    return users;
  } catch (error) {
    throw error;
  }
}

export async function getFunds() {
  const supabase = createSupabaseClient();
  try {
    const funds = await supabase.from("Fund").select("*");
    return funds;
  } catch (error) {
    throw error;
  }
}

export async function getAllAgencies() {
  const supabase = createSupabaseClient();
  try {
    const agencies = await supabase.from("Agency").select("*");
    return agencies;
  } catch (error) {
    throw error;
  }
}

export async function getFundTypes() {
  const supabase = createSupabaseClient();
  try {
    const fundTypes = await supabase.from("FundType").select("*");
    return fundTypes;
  } catch (error) {
    throw error;
  }
}

// getAgencyNameById
// getRequestsThatNeedAgreementsByUserId
// getUserIdAndEmailByRequestId
// getUserIdAndEmailByUserId
// getFundsThatNeedReceiptsByRequestId
// getUsers
// getFunds
// getAllAgencies
// getFundTypes
// getClientsByUserId
// getClientByClientId
// getAdminRequests
// getAllRequests
// getRequestById
// getRequestsByUserId
// getRequestsNeedingPreScreenByUserId
// getRequestsNeedingReceiptsByUserId
// getRequestsNeedingPostScreenByUserId
