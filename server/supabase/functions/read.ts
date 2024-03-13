import { createClient as createSupabaseClient } from "@/server/supabase/server";
import { PostgrestError } from "@supabase/supabase-js";
import { Tables } from "@/types_db";

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
      .eq("paid", true)
      .is("agreementUrl", null);
    return requests;
  } catch (error) {
    throw error;
  }
}

export async function getAllRequests() {
  const supabase = createSupabaseClient();
  try {
    const requests = await supabase
      .from("Request")
      .select(
        `*, User ( first_name, last_name ), Client ( clientID, sex, race ), Agency ( name )`,
      );
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
      .select(`*, Client ( clientID, sex, race ), Agency ( name )`)
      .eq("userId", userId);
    return requests;
  } catch (error) {
    throw error;
  }
}

export async function getFundsByRequestId(
  requestId: number,
): Promise<Tables<"Fund">[]> {
  const supabase = createSupabaseClient();
  try {
    const { data, error } = await supabase
      .from("Fund")
      .select("")
      .eq("requestId", requestId);
    if (error) {
      console.error("Error in getFundsByRequestId:", error);
      throw error;
    }
    return data as unknown as Tables<"Fund">[];
  } catch (error) {
    console.error("Unexpected error in getFundsByRequestId:", error);
    throw error;
  }
}

export async function getFundsThatNeedReceiptsByRequestId(requestId: number) {
  const supabase = createSupabaseClient();
  try {
    const funds = await supabase
      .from("Fund")
      .select(`*, FundType ( typeName )`)
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
    const users = await supabase
      .from("User")
      .select(`*, EmailAddress ( email ), Client ( clientID, sex, race )`);
    return users;
  } catch (error) {
    throw error;
  }
}

export async function getFunds() {
  const supabase = createSupabaseClient();
  try {
    const funds = await supabase
      .from("Fund")
      .select(`*, FundType ( typeName, userId)`)
      .eq("paid", true);

    return funds;
  } catch (error) {
    throw error;
  }
}

export async function getAllAgencyIds() {
  const supabase = createSupabaseClient();
  try {
    const { data, error } = await supabase.from("Agency").select("id, name");
    if (error) throw error;
    return { data, error };
  } catch (error) {
    throw error;
  }
}

export async function getUserIdByRequestId(requestId: number) {
  const supabase = createSupabaseClient();
  try {
    const user = await supabase
      .from("Request")
      .select("userId")
      .eq("id", requestId);
    return user;
  } catch (error) {
    throw error;
  }
}

export async function getEmailByUserId(userId: string) {
  const supabase = createSupabaseClient();
  try {
    const email = await supabase
      .from("EmailAddress")
      .select("*")
      .eq("userId", userId);
    return email;
  } catch (error) {
    throw error;
  }
}

export async function getClientsByUserId(userId: string) {
  const supabase = createSupabaseClient();
  try {
    const { data, error } = await supabase
      .from("Client")
      .select("*")
      .eq("userId", userId);

    if (error) {
      console.error("Error fetching clients by user ID:", error.message);

      return [];
    }

    // Return the data if no error occurred
    return data;
  } catch (error) {
    console.error("Unexpected error fetching clients by user ID:", error);
    // Return an empty array to handle unexpected errors gracefully
    return [];
  }
}

export async function getAllAgencies() {
  const supabase = createSupabaseClient();
  try {
    const { data, error } = await supabase.from("Agency").select("*");
    if (error) {
      console.error("error fetching agencies:", error.message);
      return [];
    }
    return data;
  } catch (error) {
    console.error("Unexpected error fetching agencies:", error);
    return [];
  }
}

export async function getUserByUserId(userId: string) {
  const supabase = createSupabaseClient();
  try {
    const { data, error } = await supabase
      .from("User")
      .select(`*, EmailAddress ( email )`)
      .eq("userId", userId)
      .single();
    if (error) {
      console.error("Error fetching user by user ID:", error.message);
      throw error;
    }
    return data;
  } catch (error) {
    console.log("Unexpected error fetching user by user ID:", error);
    throw error;
  }
}

export async function getFundTypes() {
  const supabase = createSupabaseClient();
  try {
    const { data, error } = await supabase.from("FundType").select("*");
    if (error) {
      console.error("error fetching fund types:", error.message);
      return [];
    }
    return data;
  } catch (error) {
    console.error("Unexpected error fetching fund types:", error);
    return [];
  }
}

export async function getFundTypeNeedsReceiptById(fundTypeId: number) {
  const supabase = createSupabaseClient();
  try {
    const { data, error } = await supabase
      .from("FundType")
      .select("needsReceipt")
      .eq("id", fundTypeId)
      .eq("needsReceipt", true)
      .single();

    if (error) throw error;
    return data ? data.needsReceipt : null;
  } catch (error) {
    console.error("Failed to fetch FundType needsReceipt value:", error);
    throw error;
  }
}

export async function getClientByClientId(clientId: number) {
  const supabase = createSupabaseClient();
  try {
    const { data, error } = await supabase
      .from("Client")
      .select("*")
      .eq("id", clientId)
      .single();
    if (error) {
      console.error("Error fetching client by client ID:", error.message);
    }
    return data;
  } catch (error) {
    console.error("Unexpected error fetching client by client ID:", error);
    return null;
  }
}

export async function getAdminRequests() {
  const supabase = createSupabaseClient();
  try {
    const requests = await supabase.from("Request").select("*");
    return requests;
  } catch (error) {
    throw error;
  }
}

export async function getRequestById(requestId: number) {
  const supabase = createSupabaseClient();
  console.log("starting getRequestById supabase read function");
  try {
    const { data, error } = await supabase
      .from("Request")
      .select(
        `*, User ( first_name, last_name, EmailAddress ( email ) ), Client ( clientID, sex, race ), Agency ( name ), Fund ( id, amount, needsReceipt, FundType ( typeName ), Receipt!public_Receipt_fundId_fkey ( id, url ) ), PreScreenAnswers ( * ), PostScreenAnswers ( * )`,
      )
      .eq("id", requestId);
    if (error) {
      console.log(error);
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}

export async function getRequestsNeedingReceiptsByUserId(userId: string) {
  const supabase = createSupabaseClient();
  try {
    const requests = await supabase
      .from("Request")
      .select("*")
      .eq("userId", userId)
      .eq("paid", true)
      .eq("needsReceipts", true)
      .eq("hasReceipts", false);
    return requests;
  } catch (error) {
    throw error;
  }
}

export async function getRequestsNeedingPostScreenByUserId(userId: string) {
  const supabase = createSupabaseClient();
  try {
    const requests = await supabase
      .from("Request")
      .select("*")
      .eq("userId", userId)
      .eq("hasPreScreen", true)
      .eq("paid", true)
      .eq("hasPostScreen", false);
    return requests;
  } catch (error) {
    throw error;
  }
}
