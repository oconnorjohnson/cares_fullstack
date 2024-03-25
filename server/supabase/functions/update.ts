import { createClient as createSupabaseClient } from "@/server/supabase/server";
import { TablesUpdate, Tables } from "@/types_db";

export async function updateFundWithAssets(
  fundId: number,
  assetIds: number[],
): Promise<boolean> {
  const supabase = createSupabaseClient();
  try {
    const { error } = await supabase
      .from("Fund")
      .update({ AssetIds: assetIds })
      .eq("id", fundId);
    if (error) {
      console.log("Error in updateFundAssetIds:", error);
      throw error;
    }
    return true;
  } catch (error) {
    throw error;
  }
}

export async function updateRequestWithPostScreen(
  requestId: number,
  postScreenId: number,
): Promise<Tables<"Request">> {
  const supabase = createSupabaseClient();
  try {
    const { data, error } = await supabase
      .from("Request")
      .update({ postScreenAnswerId: postScreenId, hasPostScreen: true })
      .eq("id", requestId)
      .select("*")
      .single();
    if (error) {
      throw new Error("Failed to update request data.");
    }
    return data;
  } catch (error) {
    throw new Error(
      `Failed to update request: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
    );
  }
}

export async function updateRequestWithPreScreen(
  requestId: number,
  preScreenId: number,
): Promise<Tables<"Request">> {
  const supabase = createSupabaseClient();
  try {
    const { data, error } = await supabase
      .from("Request")
      .update({ preScreenAnswerId: preScreenId, hasPreScreen: true })
      .eq("id", requestId)
      .select("*")
      .single();
    if (error) {
      throw new Error("Failed to update request data.");
    }
    return data;
  } catch (error) {
    throw new Error(
      `Failed to update request: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
    );
  }
}

export async function markAssetAsExpended(
  assetId: number,
  fundId: number,
): Promise<boolean> {
  const supabase = createSupabaseClient();
  try {
    const { error } = await supabase
      .from("Asset")
      .update({
        FundId: fundId,
        isReserved: false,
        isAvailable: false,
        isExpended: true,
      })
      .eq("id", assetId);
    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error in markAssetAsExpended:", error);
    throw error;
  }
}

export async function markAssetAsReserved(
  assetId: number,
  fundId: number,
): Promise<boolean> {
  const supabase = createSupabaseClient();
  try {
    const { error } = await supabase
      .from("Asset")
      .update({ FundId: fundId, isReserved: true, isAvailable: false })
      .eq("id", assetId);
    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error in markAssetAsReserved:", error);
    return false;
  }
}

export async function updateRFFBalance(
  lastVersion: number,
  rffBalanceData: TablesUpdate<"RFFBalance">,
): Promise<boolean> {
  const supabase = createSupabaseClient();

  try {
    console.log("Updating RFF balance with data:", rffBalanceData);
    // First, fetch the current version and balances of the OperatingBalance from the database
    const { data: currentRFFBalance, error: fetchError } = await supabase
      .from("RFFBalance")
      .select("version, availableBalance, totalBalance, reservedBalance")
      .eq("id", 2)
      .single(); // Assuming there's only one RFF balance record

    if (fetchError) {
      console.error("Error fetching current RFF balance:", fetchError);
      throw fetchError;
    }

    if (!currentRFFBalance) {
      throw new Error("Operating balance record not found.");
    }
    console.log(currentRFFBalance.version, lastVersion);
    // Check if the current version matches the lastVersion provided
    if (currentRFFBalance.version !== lastVersion) {
      console.error(
        "Version mismatch. The balance has been updated by another transaction.",
      );
      throw new Error(
        "Version mismatch. The balance has been updated by another transaction.",
      );
    }

    // Calculate new balances by adding the submitted values to the existing ones
    const newAvailableBalance =
      currentRFFBalance.availableBalance + rffBalanceData.availableBalance!;
    const newTotalBalance =
      currentRFFBalance.totalBalance + rffBalanceData.totalBalance!;
    const newReservedBalance =
      currentRFFBalance.reservedBalance + rffBalanceData.reservedBalance!;

    // Proceed with the update if the versions match
    const { data: updatedRFFBalance, error: updateError } = await supabase
      .from("RFFBalance")
      .update({
        availableBalance: newAvailableBalance,
        totalBalance: newTotalBalance,
        reservedBalance: newReservedBalance,
        // Increment the version number upon update
        version: lastVersion + 1,
      })
      .match({ id: 2 }) // Assuming you're matching by id
      .select("*");

    if (updateError) {
      console.error("Error updating RFF balance:", updateError);
      throw updateError;
    }

    console.log("Updated RFFBalance:", updatedRFFBalance);
    if (!updatedRFFBalance) {
      console.error("No record was updated.");
      throw new Error("No record was updated.");
    }
    return true;
    // return updatedRFFBalance as unknown as Tables<"RFFBalance">;
  } catch (error) {
    console.error("Error updating RFF balance:", error);
    throw error;
  }
}

export async function updateOperatingBalance(
  lastVersion: number,
  operatingBalanceData: TablesUpdate<"OperatingBalance">,
): Promise<boolean> {
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
    return true;
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

export async function approveRequestById(requestId: number): Promise<boolean> {
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
    return true;
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
