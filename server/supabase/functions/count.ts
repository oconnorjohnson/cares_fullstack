import { createClient as createSupabaseClient } from "@/server/supabase/server";
import { TablesInsert } from "@/types_db";

export async function countPendingRequests() {
  const supabase = createSupabaseClient();
  try {
    const { count, error } = await supabase
      .from("Request")
      .select("*", { count: "exact" })
      .eq("pendingApproval", true);
    if (error) throw error;
    console.log(error);
    console.log(count);
    return count;
  } catch (error) {
    throw error;
  }
}

export async function countCompletedRequests() {
  const supabase = createSupabaseClient();
  try {
    const { count, error } = await supabase
      .from("Request")
      .select("*", { count: "exact" })
      .eq("approved", true)
      .eq("paid", true);
    if (error) throw error;
    console.log(error);
    console.log(count);
    return count;
  } catch (error) {
    throw error;
  }
}

export async function countClientsByUserId(userId: string) {
  const supabase = createSupabaseClient();
  try {
    const { count, error } = await supabase
      .from("Client")
      .select("*", { count: "exact" })
      .eq("userId", userId);
    if (error) throw error;
    console.log(error);
    console.log(count);
    return count;
  } catch (error) {
    throw error;
  }
}

export async function countDeniedRequests() {
  const supabase = createSupabaseClient();
  try {
    const { count, error } = await supabase
      .from("Request")
      .select("*", { count: "exact" })
      .eq("denied", true);
    if (error) throw error;
    console.log(error);
    console.log(count);
    return count;
  } catch (error) {
    throw error;
  }
}

export async function countRequestsByAgency(agencyId: number) {
  const supabase = createSupabaseClient();
  try {
    const { count, error } = await supabase
      .from("Request")
      .select("*", { count: "exact" })
      .eq("agencyId", agencyId);

    if (error) throw error;

    return { count };
  } catch (error) {
    throw error;
  }
}

export async function countOpenRequestsByUserId(userId: string) {
  const supabase = createSupabaseClient();
  try {
    const { count, error } = await supabase
      .from("Request")
      .select("*", { count: "exact" })
      .eq("userId", userId)
      .eq("pendingApproval", true)
      .eq("approved", false)
      .eq("denied", false);
    return count;
  } catch (error) {
    throw error;
  }
}

export async function countApprovedRequestsByUserId(userId: string) {
  const supabase = createSupabaseClient();
  try {
    const { count, error } = await supabase
      .from("Request")
      .select("*", { count: "exact" })
      .eq("userId", userId)
      .eq("approved", true)
      .eq("pendingApproval", false)
      .eq("denied", false);
    return count;
  } catch (error) {
    throw error;
  }
}

export async function countDeniedRequestsByUserId(userId: string) {
  const supabase = createSupabaseClient();
  try {
    const { count, error } = await supabase
      .from("Request")
      .select("*", { count: "exact" })
      .eq("userId", userId)
      .eq("denied", true);
    return count;
  } catch (error) {
    throw error;
  }
}

export const runtime = "edge";
