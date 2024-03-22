import { createClient as createSupabaseClient } from "@/server/supabase/server";
import { Tables, TablesInsert } from "@/types_db";

export async function createAgency(agencyData: TablesInsert<"Agency">) {
  const supabase = createSupabaseClient();

  const { data, error } = await supabase.from("Agency").insert([agencyData]);

  if (error) throw error;
  return data;
}

export async function createTransaction(
  transactionData: TablesInsert<"Transaction">,
): Promise<number> {
  const supabase = createSupabaseClient();
  const { data, error } = await supabase
    .from("Transaction")
    .insert([transactionData])
    .select("id");
  if (error) {
    console.error("Error in createTransaction:", error);
    throw error;
  }
  if (!data || data.length === 0) {
    console.error("No data returned from supabase");
    throw new Error("No data returned from supabase");
  }
  const transactionId = data[0].id;
  if (typeof transactionId !== "number") {
    throw new Error("Transaction ID is not a number");
  }
  return transactionId;
}

export async function createAsset(
  assetData: TablesInsert<"Asset">,
): Promise<boolean> {
  const supabase = createSupabaseClient();
  const { data, error } = await supabase.from("Asset").insert([assetData]);
  if (error) {
    console.error("Error in createAsset:", error);
    throw error;
  }
  return true;
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
    if (error) {
      console.error("Error in createFundType:", error);
      throw error;
    }
    return data;
  } catch (error) {
    console.error("Unexpected error in createFundType:", error);
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
    const { data: newReceiptData, error: newReceiptError } = await supabase
      .from("Receipt")
      .insert([newReceiptRecord]);
    if (newReceiptError) {
      console.log("Error creating new receipt record:", newReceiptError);
      throw newReceiptError;
    }
    const { error: updateRequestError } = await supabase
      .from("Request")
      .update({ hasReceipts: true })
      .match({ id: newReceiptRecord.requestId });
    if (updateRequestError) {
      console.log(
        "Error updating request to have receipts:",
        updateRequestError,
      );
      throw updateRequestError;
    }
    return newReceiptData;
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
  console.log("Creating new pre-screen record with data:", preScreenData);
  try {
    const { data: preScreenDataResult, error: preScreenError } = await supabase
      .from("PreScreenAnswers")
      .insert([preScreenData])
      .select("*")
      .single();
    if (preScreenError) {
      console.error(
        "Error during insert operation in PreScreenAnswers table:",
        preScreenError,
      );
      throw new Error(preScreenError.message);
    }
    return preScreenDataResult;
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
): Promise<Tables<"PostScreenAnswers">> {
  const supabase = createSupabaseClient();
  console.log("Creating new post-screen record with data:", postScreenData);
  try {
    const { data: postScreenDataResult, error: postScreenError } =
      await supabase
        .from("PostScreenAnswers")
        .insert([postScreenData])
        .select("*")
        .single();
    if (postScreenError) {
      console.error(
        "Error during insert operation in PreScreenAnswers table:",
        postScreenError,
      );
      throw new Error(postScreenError.message);
    }
    return postScreenDataResult;
  } catch (error) {
    throw new Error(
      `Failed to create new pre-screen record: ${
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
    const { data, error } = await supabase
      .from("Request")
      .insert([requestData])
      .select()
      .single();
    if (error) {
      console.error("Error during insert operation in Request table:", error);
      throw new Error(error.message);
    }
    console.log("Request created successfully:", data);
    return data;
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
