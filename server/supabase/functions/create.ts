import { createClient as createSupabaseClient } from "@/server/supabase/server";
import { TablesInsert } from "@/types_db";

export async function createAgency(agencyData: TablesInsert<"Agency">) {
  const supabase = createSupabaseClient();

  const { data, error } = await supabase.from("Agency").insert([agencyData]);

  if (error) throw error;
  return data;
}

export async function createFundType(fundTypeData: TablesInsert<"FundType">) {
  const supabase = createSupabaseClient();
  if (!fundTypeData.userId || !fundTypeData.typeName) {
    throw new Error("UserId and Type Name are required.");
  }
  try {
    const { data, error } = await supabase
      .from("FundType")
      .insert([fundTypeData]);
    if (error) throw error;
    return data;
  } catch (error) {
    throw new Error(
      `Failed to create fund type: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
}

export async function createNewReceiptRecord(
  newReceiptRecord: TablesInsert<"Receipt">,
) {
  const supabase = createSupabaseClient();
  if (
    !newReceiptRecord.userId ||
    !newReceiptRecord.url ||
    !newReceiptRecord.requestId ||
    !newReceiptRecord.fundId
  ) {
    throw new Error("UserId, URL, Request ID, and Fund ID are required.");
  }
  console.log("Creating new receipt record with data:", newReceiptRecord);
  try {
    const { data, error } = await supabase
      .from("Receipt")
      .insert([newReceiptRecord]);
    if (error) throw error;
    return data;
  } catch (error) {
    throw new Error(
      `Failed to create new receipt record: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
    );
  }
}

export async function createNewFundByRequestId(
  newFundData: TablesInsert<"Fund">,
) {
  const supabase = createSupabaseClient();
  if (
    !newFundData.requestId ||
    !newFundData.fundTypeId ||
    !newFundData.amount
  ) {
    throw new Error("Request ID, Fund Type ID, and Amount are required.");
  }
  console.log("Creating new fund with data:", newFundData);
  try {
    const { data, error } = await supabase.from("Fund").insert([newFundData]);
    if (error) throw error;
    return data;
  } catch (error) {
    throw new Error(
      `Failed to create new fund: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
    );
  }
}

export async function createPreScreen(
  preScreenData: TablesInsert<"PreScreenAnswers">,
) {
  const supabase = createSupabaseClient();
  if (
    !preScreenData.housingSituation ||
    !preScreenData.housingQuality ||
    !preScreenData.utilityStress ||
    !preScreenData.foodInsecurityStress ||
    !preScreenData.foodMoneyStress ||
    !preScreenData.transpoConfidence ||
    !preScreenData.transpoStress ||
    !preScreenData.financialDifficulties ||
    !preScreenData.requestId
  ) {
    throw new Error("Request ID, and all pre-screen data are required.");
  }
  console.log("Creating new pre-screen record with data:", preScreenData);
  try {
    const { data, error } = await supabase
      .from("PreScreenAnswers")
      .insert([preScreenData]);
    if (error) throw error;
    return data;
  } catch (error) {
    throw new Error(
      `Failed to create new pre-screen record: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
    );
  }
}

export async function createPostScreen(
  postScreenData: TablesInsert<"PostScreenAnswers">,
) {
  const supabase = createSupabaseClient();
  if (
    !postScreenData.housingSituation ||
    !postScreenData.housingQuality ||
    !postScreenData.utilityStress ||
    !postScreenData.foodInsecurityStress ||
    !postScreenData.foodMoneyStress ||
    !postScreenData.transpoConfidence ||
    !postScreenData.transpoStress ||
    !postScreenData.financialDifficulties ||
    !postScreenData.requestId
  ) {
    throw new Error("Request ID, and all post-screen data are required.");
  }
  console.log("Creating new post-screen record with data:", postScreenData);
  try {
    const { data, error } = await supabase
      .from("PostScreenAnswers")
      .insert([postScreenData]);
    if (error) throw error;
    return data;
  } catch (error) {
    throw new Error(
      `Failed to create new post-screen record: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
    );
  }
}

export async function createUser(userData: TablesInsert<"User">) {
  const supabase = createSupabaseClient();
  if (!userData.userId || !userData.first_name || !userData.last_name) {
    throw new Error("UserId, First Name, and Last Name are required.");
  }
  const existingUser = await supabase
    .from("User")
    .select("*")
    .eq("userId", userData.userId);
  if (existingUser) {
    throw new Error("User with userId ${userData.userId} already exists.");
  }
  try {
    const { data, error } = await supabase.from("User").insert([userData]);
    if (error) throw error;
    return data;
  } catch (error) {
    throw new Error(
      `Failed to create user: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
}

export async function createRequest(requestData: TablesInsert<"Request">) {
  const supabase = createSupabaseClient();
  if (
    !requestData.clientId ||
    !requestData.userId ||
    !requestData.agencyId ||
    !requestData.details ||
    !requestData.implementation ||
    !requestData.sustainability ||
    !requestData.SDOH ||
    !requestData.RFF
  ) {
    throw new Error("Request data is required.");
  }
  try {
    const { data, error } = await supabase
      .from("Request")
      .insert([requestData]);
    if (error) throw error;
    return data;
  } catch (error) {
    throw new Error(
      `Failed to create request: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
    );
  }
}

export async function createFunds(fundsData: TablesInsert<"Fund">[]) {
  const supabase = createSupabaseClient();

  try {
    const { data, error } = await supabase.from("Fund").insert(fundsData);
    if (error) throw error;
    return data;
  } catch (error) {
    throw new Error(
      `Failed to create funds: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
}

export async function createClient(clientData: TablesInsert<"Client">) {
  const supabase = createSupabaseClient();
  if (!clientData.clientID || !clientData.race || !clientData.sex) {
    throw new Error("ClientId, First Name, and Last Name are required.");
  }
  try {
    const { data, error } = await supabase.from("Client").insert([clientData]);
    if (error) throw error;
    return data;
  } catch (error) {
    throw new Error(
      `Failed to create client: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
}
