import { createClient as createSupabaseClient } from "@/server/supabase/server";
import { TablesUpdate } from "@/types_db";

export async function updateRFFBalance(
  lastVersion: number,
  rffBalanceData: TablesUpdate<"RFFBalance">,
): Promise<TablesUpdate<"RFFBalance">> {
  const supabase = createSupabaseClient();
  if (!rffBalanceData.id) {
    throw new Error("RFFBalance id is required.");
  }

  try {
    // First, fetch the current version of the RFFBalance from the database
    const { data: currentRFFBalance, error: fetchError } = await supabase
      .from("RFFBalance")
      .select("version")
      .eq("id", rffBalanceData.id)
      .single();

    if (fetchError) throw fetchError;

    // Check if the current version matches the lastVersion provided
    if (currentRFFBalance.version !== lastVersion) {
      throw new Error(
        "Version mismatch. The balance has been updated by another transaction.",
      );
    }

    // Proceed with the update if the versions match
    const { data: updatedRFFBalance, error: updateError } = await supabase
      .from("RFFBalance")
      .update({
        availableBalance: rffBalanceData.availableBalance,
        // Increment the version number upon update
        version: lastVersion + 1,
      })
      .match({ id: rffBalanceData.id });

    if (updateError) throw updateError;

    console.log("Updated RFFBalance:", updatedRFFBalance);
    if (!updatedRFFBalance) {
      throw new Error("No record was updated.");
    }
    return updatedRFFBalance as TablesUpdate<"RFFBalance">;
  } catch (error) {
    throw error;
  }
}

export async function updateOperatingBalance(
  lastVersion: number,
  operatingBalanceData: TablesUpdate<"OperatingBalance">,
): Promise<TablesUpdate<"OperatingBalance">> {
  const supabase = createSupabaseClient();

  try {
    console.log("Updating operating balance with data:", operatingBalanceData);
    // First, fetch the current version and balances of the OperatingBalance from the database
    const { data: currentOperatingBalance, error: fetchError } = await supabase
      .from("OperatingBalance")
      .select("version, availableBalance, totalBalance")
      .eq("id", 2)
      .single(); // Assuming there's only one operating balance record

    if (fetchError) {
      console.error("Error fetching current operating balance:", fetchError);
      throw fetchError;
    }

    if (!currentOperatingBalance) {
      throw new Error("Operating balance record not found.");
    }
    console.log(currentOperatingBalance.version, lastVersion);
    // Check if the current version matches the lastVersion provided
    if (currentOperatingBalance.version !== lastVersion) {
      console.error(
        "Version mismatch. The balance has been updated by another transaction.",
      );
      throw new Error(
        "Version mismatch. The balance has been updated by another transaction.",
      );
    }

    // Calculate new balances by adding the submitted values to the existing ones
    const newAvailableBalance =
      currentOperatingBalance.availableBalance +
      operatingBalanceData.availableBalance!;
    const newTotalBalance =
      currentOperatingBalance.totalBalance + operatingBalanceData.totalBalance!;

    // Proceed with the update if the versions match
    const { data: updatedOperatingBalance, error: updateError } = await supabase
      .from("OperatingBalance")
      .update({
        availableBalance: newAvailableBalance,
        totalBalance: newTotalBalance,
        // Increment the version number upon update
        version: lastVersion + 1,
      })
      .match({ id: 2 }) // Assuming you're matching by id
      .select("*");

    if (updateError) {
      console.error("Error updating operating balance:", updateError);
      throw updateError;
    }

    console.log("Updated OperatingBalance:", updatedOperatingBalance);
    if (!updatedOperatingBalance) {
      console.error("No record was updated.");
      throw new Error("No record was updated.");
    }
    return updatedOperatingBalance as unknown as TablesUpdate<"OperatingBalance">;
  } catch (error) {
    console.error("Error updating operating balance:", error);
    throw error;
  }
}

export async function updateUser(
  userId: string,
  userData: TablesUpdate<"User">,
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
