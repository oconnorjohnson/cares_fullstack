import { createClient as createSupabaseClient } from "@/server/supabase/server";
import { Tables } from "@/types_db";
import type { Request } from "@/server/actions/request/actions";
type totalValue = {
  id: number;
  totalValue: number;
};

type id = {
  id: number;
};

export async function getNewsCardOne() {
  const supabase = createSupabaseClient();
  try {
    const { data, error } = await supabase
      .from("NewsCards")
      .select("*")
      .eq("id", 1)
      .single(); // Use .single() to get a single object
    if (error) {
      console.log("Error in getNewsCardOne:", error);
      throw error;
    }
    // Ensure data matches the NewsCard type
    return {
      card_title: data.card_title,
      card_description: data.card_description,
      card_content: data.card_content,
    };
  } catch (error) {
    console.log("Unexpected error in getNewsCardOne:", error);
    throw error;
  }
}

export async function getNewsCardTwo() {
  const supabase = createSupabaseClient();
  try {
    const { data, error } = await supabase
      .from("NewsCards")
      .select("*")
      .eq("id", 2)
      .single(); // Use .single() to get a single object
    if (error) {
      console.log("Error in getNewsCardOne:", error);
      throw error;
    }
    // Ensure data matches the NewsCard type
    return {
      card_title: data.card_title,
      card_description: data.card_description,
      card_content: data.card_content,
    };
  } catch (error) {
    console.log("Unexpected error in getNewsCardTwo:", error);
    throw error;
  }
}

export async function getNewsCardThree() {
  const supabase = createSupabaseClient();
  try {
    const { data, error } = await supabase
      .from("NewsCards")
      .select("*")
      .eq("id", 3)
      .single(); // Use .single() to get a single object
    if (error) {
      console.log("Error in getNewsCardOne:", error);
      throw error;
    }
    // Ensure data matches the NewsCard type
    return {
      card_title: data.card_title,
      card_description: data.card_description,
      card_content: data.card_content,
    };
  } catch (error) {
    console.log("Unexpected error in getNewsCardThree:", error);
    throw error;
  }
}

export async function hasAdminAgreed({
  requestId,
  userId,
}: {
  requestId: number;
  userId: string;
}) {
  const supabase = createSupabaseClient();
  try {
    const { data, error } = await supabase
      .from("Request")
      .select("*")
      .eq("id", requestId)
      .single();
    if (error) {
      throw error;
    } else if (data?.adminOne === userId) {
      return true;
    } else if (data?.adminTwo === userId) {
      return true;
    } else if (data?.adminThree === userId) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.log("Unexpected error in hasAdminAgreed function:", error);
    throw error;
  }
}

export async function isAnyNull(requestId: number): Promise<boolean> {
  const supabase = createSupabaseClient();
  try {
    const { data, error } = await supabase
      .from("Request")
      .select("*")
      .eq("id", requestId)
      .single();
    if (error) {
      console.log("Error in isAnyNull:", error);
      throw error;
    }
    if (
      data?.adminOne === null ||
      data?.adminTwo === null ||
      data?.adminThree === null
    ) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.log("unexpected error in isAnyNull function:", error);
    throw error;
  }
}

export async function isAdminOneNull(requestId: number): Promise<boolean> {
  const supabase = createSupabaseClient();
  try {
    const { data, error } = await supabase
      .from("Request")
      .select("adminOne")
      .eq("id", requestId)
      .single();
    if (error) {
      console.log("Error in isAdminOneNull:", error);
      throw error;
    }
    return data?.adminOne === null;
  } catch (error) {
    console.log("unexpected error in isAdminOneNull function:", error);
    throw error;
  }
}

export async function isAdminTwoNull(requestId: number): Promise<boolean> {
  const supabase = createSupabaseClient();
  try {
    const { data, error } = await supabase
      .from("Request")
      .select("adminTwo")
      .eq("id", requestId)
      .single();
    if (error) {
      console.log("Error in isAdminTwoNull:", error);
      throw error;
    }
    return data?.adminTwo === null;
  } catch (error) {
    console.log("unexpected error in isAdminTwoNull function:", error);
    throw error;
  }
}

export async function isAdminThreeNull(requestId: number): Promise<boolean> {
  const supabase = createSupabaseClient();
  try {
    const { data, error } = await supabase
      .from("Request")
      .select("adminThree")
      .eq("id", requestId)
      .single();
    if (error) {
      console.log("Error in isAdminThreeNull:", error);
      throw error;
    }
    return data?.adminThree === null;
  } catch (error) {
    console.log("unexpected error in isAdminThreeNull function:", error);
    throw error;
  }
}

export async function getAdminEmailPreferenceByUserId(userId: string) {
  const supabase = createSupabaseClient();
  try {
    const { data, error } = await supabase
      .from("AdminEmailPrefs")
      .select("*")
      .eq("UserId", userId)
      .single();
    if (error) {
      console.log("Error in getAdminEmailPreferenceByUserId:", error);
      throw error;
    }
    return data;
  } catch (error) {
    console.log("Unexpected error in getAdminEmailPreferenceByUserId:", error);
    throw error;
  }
}

export async function getAdminEmailPreferenceById(
  AdminEmailPrefId: number,
): Promise<Tables<"AdminEmailPrefs">> {
  const supabase = createSupabaseClient();
  try {
    const { data, error } = await supabase
      .from("AdminEmailPrefs")
      .select("*")
      .eq("id", AdminEmailPrefId)
      .single();
    if (error) {
      console.log("Error in getAdminEmailPreferenceById:", error);
      throw error;
    }
    return data;
  } catch (error) {
    console.log("Unexpected error in getAdminEmailPreferenceById:", error);
    throw error;
  }
}

export async function getAllPreScreenAnswers(): Promise<
  Tables<"PreScreenAnswers">[]
> {
  const supabase = createSupabaseClient();
  try {
    const { data, error } = await supabase.from("PreScreenAnswers").select("*");
    if (error) {
      console.error("Error in getAllPreScreenAnswers:", error);
      throw error;
    }
    return data;
  } catch (error) {
    console.error("Unexpected error in getAllPreScreenAnswers:", error);
    throw error;
  }
}

export async function getAllPostScreenAnswers(): Promise<
  Tables<"PostScreenAnswers">[]
> {
  const supabase = createSupabaseClient();
  try {
    const { data, error } = await supabase
      .from("PostScreenAnswers")
      .select("*");
    if (error) {
      console.error("Error in getAllPostScreenAnswers:", error);
      throw error;
    }
    return data;
  } catch (error) {
    console.error("Unexpected error in getAllPostScreenAnswers:", error);
    throw error;
  }
}

export async function getAssetIdsByFundId(
  fundId: number,
): Promise<{ AssetIds: number[] | null }> {
  const supabase = createSupabaseClient();
  try {
    const { data, error } = await supabase
      .from("Fund")
      .select("AssetIds")
      .eq("id", fundId)
      .single();
    if (error) {
      console.log("Error in getAssetIdsByFundId:", error);
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}

export async function getAssetFundTypeById(AssetId: number): Promise<
  {
    FundTypeId: number;
  }[]
> {
  const supabase = createSupabaseClient();
  try {
    const { data, error } = await supabase
      .from("Asset")
      .select("FundTypeId")
      .eq("id", AssetId);
    if (error) {
      console.log("Error in getAssetById:", error);
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}

export async function getRFFBusPasses(): Promise<id[]> {
  const supabase = createSupabaseClient();
  try {
    const { data, error } = await supabase
      .from("Asset")
      .select("id")
      .eq("FundTypeId", 3)
      .eq("isAvailable", true)
      .eq("isRFF", true)
      .eq("isCARES", false);
    if (error) {
      console.error("Error in getRFFBusPasses:", error);
      throw error;
    }
    return data;
  } catch (error) {
    console.error("Error in getRFFBusPasses:", error);
    throw error;
  }
}

export async function getRFFWalmartCards(): Promise<totalValue[]> {
  const supabase = createSupabaseClient();
  try {
    const { data, error } = await supabase
      .from("Asset")
      .select("id, totalValue")
      .eq("FundTypeId", 1)
      .eq("isAvailable", true)
      .eq("isRFF", true)
      .eq("isCARES", false);
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error in getWalmartCards:", error);
    throw error;
  }
}

export async function getRFFArcoCards(): Promise<totalValue[]> {
  const supabase = createSupabaseClient();
  try {
    const { data, error } = await supabase
      .from("Asset")
      .select("id, totalValue")
      .eq("FundTypeId", 2)
      .eq("isAvailable", true)
      .eq("isRFF", true)
      .eq("isCARES", false);
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error in getArcoCards:", error);
    throw error;
  }
}

export async function getReservedRFFArcoCards(): Promise<totalValue[]> {
  const supabase = createSupabaseClient();
  try {
    const { data, error } = await supabase
      .from("Asset")
      .select("id, totalValue")
      .eq("FundTypeId", 2)
      .eq("isAvailable", false)
      .eq("isRFF", true)
      .eq("isCARES", false)
      .eq("isReserved", true);
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error in getReservedArcoCards:", error);
    throw error;
  }
}

export async function getReservedRFFWalmartCards(): Promise<totalValue[]> {
  const supabase = createSupabaseClient();
  try {
    const { data, error } = await supabase
      .from("Asset")
      .select("id, totalValue")
      .eq("FundTypeId", 1)
      .eq("isAvailable", false)
      .eq("isRFF", true)
      .eq("isCARES", false)
      .eq("isReserved", true);
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error in getReservedWalmartCards:", error);
    throw error;
  }
}

export async function getReservedRFFBusPasses(): Promise<id[]> {
  const supabase = createSupabaseClient();
  try {
    const { data, error } = await supabase
      .from("Asset")
      .select("id")
      .eq("FundTypeId", 3)
      .eq("isAvailable", false)
      .eq("isRFF", true)
      .eq("isCARES", false)
      .eq("isReserved", true);
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error in getReservedBusPasses:", error);
    throw error;
  }
}

export async function getTransactions() {
  const supabase = createSupabaseClient();
  try {
    const { data, error } = await supabase.from("Transaction").select("*");
    if (error) {
      console.error("Error in getTransactions:", error);
      throw error;
    }
    return data;
  } catch (error) {
    console.error("Unexpected error in getTransactions:", error);
    throw error;
  }
}
export async function getOperatingBalance() {
  const supabase = createSupabaseClient();
  try {
    const { data, error } = await supabase
      .from("OperatingBalance")
      .select("*")
      .eq("id", 2);
    if (error) {
      console.error("Error in getOperatingBalance:", error);
      throw error;
    }
    return data;
  } catch (error) {
    console.error("Unexpected error in getOperatingBalance:", error);
    throw error;
  }
}
export async function getRFFBalance() {
  const supabase = createSupabaseClient();
  try {
    const { data, error } = await supabase.from("RFFBalance").select("*");
    if (error) {
      console.error("Error in getRFFBalance:", error);
      throw error;
    }
    return data;
  } catch (error) {
    console.error("Unexpected error in getRFFBalance:", error);
    throw error;
  }
}

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
  console.log("getAllRequests supabase function running");
  const supabase = createSupabaseClient();
  try {
    const { data, error, status } = await supabase
      .from("Request")
      .select(
        `*, User ( first_name, last_name ), Client ( clientID, sex, race ), Agency ( name )`,
      );

    if (error) {
      console.error(
        "Error fetching all requests:",
        error,
        "Status code:",
        status,
      );
      throw error;
    }

    if (!data) {
      console.log("No data returned", "Status code:", status);
      return [];
    }

    console.log("Fetched requests data:", data);
    return data;
  } catch (error) {
    console.error("Unexpected error in getAllRequests:", error);
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
        `*, User ( first_name, last_name, EmailAddress ( email ) ), Client ( clientID, sex, race ), Agency ( name ), Fund ( id, amount, needsReceipt, FundType ( typeName ), Receipt!public_Receipt_fundId_fkey ( id, url ) ), PreScreenAnswers ( * ), PostScreenAnswers ( * ), Receipt ( * )`,
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
