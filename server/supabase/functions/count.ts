import { createClient as createSupabaseClient } from "@/server/supabase/server";

export async function countRFFWalmartCards(): Promise<{
  count: number | null;
  totalSum: number | null;
}> {
  const supabase = createSupabaseClient();
  try {
    const { data, error, count } = await supabase
      .from("Asset")
      .select("totalValue", { count: "exact" })
      .eq("isRFF", true)
      .eq("isCARES", false)
      .eq("isAvailable", true)
      .eq("FundTypeId", 1);

    if (error) throw error;

    const totalSum = data.reduce(
      (acc, { totalValue }) => acc + Number(totalValue),
      0,
    );

    return { count, totalSum };
  } catch (error) {
    console.error("Error in countRFFWalmartCards:", error);
    throw error;
  }
}

export async function countRFFArcoCards(): Promise<{
  count: number | null;
  totalSum: number | null;
}> {
  const supabase = createSupabaseClient();
  try {
    const { data, count, error } = await supabase
      .from("Asset")
      .select("*", { count: "exact" })
      .eq("isRFF", true)
      .eq("isCARES", false)
      .eq("isAvailable", true)
      .eq("FundTypeId", 2);
    if (error) throw error;
    const totalSum = data.reduce(
      (acc, { totalValue }) => acc + Number(totalValue),
      0,
    );

    return { count, totalSum };
  } catch (error) {
    throw error;
  }
}

export async function countCARESWalmartCards(): Promise<{
  count: number | null;
  totalSum: number | null;
}> {
  const supabase = createSupabaseClient();
  try {
    const { data, count, error } = await supabase
      .from("Asset")
      .select("*", { count: "exact" })
      .eq("isRFF", false)
      .eq("isCARES", true)
      .eq("FundTypeId", 1);
    if (error) throw error;
    const totalSum = data.reduce(
      (acc, { totalValue }) => acc + Number(totalValue),
      0,
    );

    return { count, totalSum };
  } catch (error) {
    throw error;
  }
}

export async function countCARESArcoCards(): Promise<{
  count: number | null;
  totalSum: number | null;
}> {
  const supabase = createSupabaseClient();
  try {
    const { data, count, error } = await supabase
      .from("Asset")
      .select("*", { count: "exact" })
      .eq("isRFF", false)
      .eq("isCARES", true)
      .eq("FundTypeId", 2);
    if (error) throw error;
    const totalSum = data.reduce(
      (acc, { totalValue }) => acc + Number(totalValue),
      0,
    );

    return { count, totalSum };
  } catch (error) {
    throw error;
  }
}

export async function countAvailableRFFBusPasses(): Promise<number | null> {
  const supabase = createSupabaseClient();
  try {
    const { count, error } = await supabase
      .from("Asset")
      .select("*", { count: "exact" })
      .eq("FundTypeId", 3)
      .eq("isAvailable", true)
      .eq("isRFF", true)
      .eq("isCARES", false);
    if (error) {
      console.error("Error in countAvailableRFFBusPasses:", error);
      throw error;
    }
    return count;
  } catch (error) {
    console.error("Unexpected error in countAvailableRFFBusPasses:", error);
    throw error;
  }
}

export async function countReservedRFFBusPasses(): Promise<number | null> {
  const supabase = createSupabaseClient();
  try {
    const { count, error } = await supabase
      .from("Asset")
      .select("*", { count: "exact" })
      .eq("FundTypeId", 3)
      .eq("isAvailable", false)
      .eq("isReserved", true)
      .eq("isRFF", true)
      .eq("isCARES", false);
    if (error) {
      console.error("Error in countReservedRFFBusPasses:", error);
      throw error;
    }
    return count;
  } catch (error) {
    console.error("Unexpected error in countReservedRFFBusPasses:", error);
    throw error;
  }
}

export async function countAvailableCARESBusPasses(): Promise<number | null> {
  const supabase = createSupabaseClient();
  try {
    const { count, error } = await supabase
      .from("Asset")
      .select("*", { count: "exact" })
      .eq("FundTypeId", 3)
      .eq("isAvailable", true)
      .eq("isRFF", false)
      .eq("isCARES", true);
    if (error) {
      console.error("Error in countAvailableCARESBusPasses:", error);
      throw error;
    }
    return count;
  } catch (error) {
    console.error("Unexpected error in countAvailableCARESBusPasses:", error);
    throw error;
  }
}

export async function countReservedCARESBusPasses(): Promise<number | null> {
  const supabase = createSupabaseClient();
  try {
    const { count, error } = await supabase
      .from("Asset")
      .select("*", { count: "exact" })
      .eq("FundTypeId", 3)
      .eq("isAvailable", false)
      .eq("isReserved", true)
      .eq("isRFF", false)
      .eq("isCARES", true);
    if (error) {
      console.error("Error in countReservedCARESBusPasses:", error);
      throw error;
    }
    return count;
  } catch (error) {
    console.error("Unexpected error in countReservedCARESBusPasses:", error);
    throw error;
  }
}

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
