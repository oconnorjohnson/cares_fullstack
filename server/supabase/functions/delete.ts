import { createClient as createSupabaseClient } from "@/server/supabase/server";
import { TablesInsert } from "@/types_db";

export async function deleteUser(userId: string) {
  const supabase = createSupabaseClient();
  try {
    const deletedUser = await supabase
      .from("User")
      .delete()
      .eq("userId", userId);
    return deletedUser;
  } catch (error) {
    throw error;
  }
}

export async function deleteFundById(fundId: number) {
  const supabase = createSupabaseClient();
  try {
    const deletedFund = await supabase.from("Fund").delete().eq("id", fundId);
    return deletedFund;
  } catch (error) {
    throw error;
  }
}

export async function deleteAgencyById(agencyId: number) {
  const supabase = createSupabaseClient();
  try {
    const deletedAgency = await supabase
      .from("Agency")
      .delete()
      .eq("id", agencyId);
    return deletedAgency;
  } catch (error) {
    throw error;
  }
}

export async function deleteFundTypeById(fundTypeId: number) {
  const supabase = createSupabaseClient();
  try {
    const deletedFundType = await supabase
      .from("FundType")
      .delete()
      .eq("id", fundTypeId);
    return deletedFundType;
  } catch (error) {
    throw error;
  }
}

export async function deleteClientById(clientId: number) {
  const supabase = createSupabaseClient();
  try {
    const deletedClient = await supabase
      .from("Client")
      .delete()
      .eq("id", clientId);
    return deletedClient;
  } catch (error) {
    throw error;
  }
}

export async function deleteRequestById(requestId: number) {
  const supabase = createSupabaseClient();
  try {
    const deletedRequest = await supabase
      .from("Request")
      .delete()
      .eq("id", requestId);
    return deletedRequest;
  } catch (error) {
    throw error;
  }
}

export const runtime = "edge";
