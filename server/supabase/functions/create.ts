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
    // Check if the pre-screen data was successfully inserted

    // Update the related Request to set hasPreScreen to TRUE
    const updateError = await supabase
      .from("Request")
      .update({ hasPreScreen: true })
      .eq("id", preScreenData.requestId) // Assuming 'requestId' is the column name in the Request table that relates to the pre-screen data
      .then(({ error }) => error);

    if (updateError) throw updateError;

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
  try {
    const { data, error } = await supabase.from("User").insert([
      {
        userId: userData.userId,
        first_name: userData.first_name,
        last_name: userData.last_name,
      },
    ]);
    if (error) {
      console.error("Supabase error:", error);
      throw error;
    }
    return data;
  } catch (error) {
    console.error("Failed to create user:", error);
    throw new Error(
      `Failed to create user: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
}

export async function createEmailAddresses(
  emailData: TablesInsert<"EmailAddress">[],
) {
  const supabase = createSupabaseClient();
  console.log("Starting createEmailAddresses function");

  console.log("Received email data:", emailData);

  const inserts = emailData.map((emailAddress) => ({
    userId: emailAddress.userId,
    email: emailAddress.email,
  }));
  console.log("Prepared inserts:", inserts);

  try {
    const { data, error } = await supabase.from("EmailAddress").insert(inserts);
    console.log("Insert operation response data:", data);
    if (error) {
      console.error("Error during insert operation:", error);
      throw error;
    }
    console.log("Successfully inserted email addresses:", data);
    return data;
  } catch (error) {
    console.error("Failed to create email addresses:", error);
    throw new Error(
      `Failed to create email addresses: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
    );
  }
}

export async function createRequest(
  requestData: TablesInsert<"Request">,
): Promise<TablesInsert<"Request">> {
  const supabase = createSupabaseClient();
  console.log("Attempting to create request with data:", requestData);

  try {
    // Insert the request data and return only the newly created request
    const { data, error } = await supabase
      .from("Request")
      .insert([requestData])
      .select()
      .single(); // Ensures that only the newly inserted record is returned

    if (error) {
      console.error("Error during insert operation in Request table:", error);
      throw new Error(error.message);
    }

    console.log("Request created successfully:", data);
    return data; // Return the newly created request
  } catch (error) {
    console.error("Failed to create request:", error);
    throw new Error(
      `Failed to create request: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
}

export async function createFunds(fundsData: TablesInsert<"Fund">[]) {
  const supabase = createSupabaseClient();
  console.log("Attempting to create funds with data:", fundsData);
  try {
    const { data, error } = await supabase
      .from("Fund")
      .insert(fundsData)
      .select("*");
    if (error) {
      console.error("Error during insert operation in Fund table:", error);
      throw error;
    }
    console.log("Funds insert response data:", data);
    return data;
  } catch (error) {
    console.error("Failed to create funds:", error);
    throw new Error(
      `Failed to create funds: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
}

export async function createClient(clientData: TablesInsert<"Client">) {
  const supabase = createSupabaseClient();
  console.log("Starting createClient function");

  console.log("Received client data for insertion:", clientData);

  if (
    !clientData.clientID ||
    !clientData.race ||
    !clientData.sex ||
    !clientData.userId
  ) {
    console.error(
      "Missing at least one of the required client data fields: userId, clientID, race, and sex",
    );
    throw new Error("lientID, Race, and Sex are required.");
  }

  try {
    const { data, error } = await supabase
      .from("Client")
      .insert([clientData])
      .select("*");
    console.log("Insert operation response data:", data);
    if (error) {
      console.error("Error during insert operation in Client table:", error);
      throw error;
    }
    console.log("Successfully inserted client into Client table:", data);
    return data;
  } catch (error) {
    console.error("Failed to create client in Client table:", error);
    throw new Error(
      `Failed to create client: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
}
