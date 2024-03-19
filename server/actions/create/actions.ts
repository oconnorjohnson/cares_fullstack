"use server";
import {
  createClient,
  createFundType,
  createAgency,
  createRequest,
  createPreScreen,
  createPostScreen,
  createNewFundByRequestId,
  createFunds,
  createTransaction as createNewTransaction,
  createAsset as createNewAsset,
} from "@/server/supabase/functions/create";
import { getFundTypeNeedsReceiptById } from "@/server/supabase/functions/read";
import {
  updateOperatingBalance,
  updateRFFBalance,
} from "@/server/supabase/functions/update";
import { Submitted } from "@/server/actions/resend/actions";
import {
  markRequestAsNeedingReceipt,
  markRequestAsNotNeedingReceipt,
} from "@/server/actions/update/actions";
import { EmailTemplate as SubmittedEmailTemplate } from "@/components/emails/submitted";
import { EmailTemplate as CompletedEmailTemplate } from "@/components/emails/completed";
import { Resend } from "resend";
import { revalidatePath } from "next/cache";
import { TablesInsert } from "@/types_db";
import { StringValidation } from "zod";

// Extracted from types_db.ts for brevity and clarity
interface RequestInsert {
  agencyId: number;
  agreementUrl?: string | null;
  approved?: boolean;
  clientId: number;
  created_at?: string;
  denied?: boolean;
  details: string;
  hasPostScreen?: boolean;
  hasPreScreen?: boolean;
  hasReceipts?: boolean;
  id?: number;
  implementation: string;
  needsReceipts?: boolean;
  paid?: boolean;
  pendingApproval?: boolean;
  pendingPayout?: boolean;
  postScreenAnswerId?: number | null;
  preScreenAnswerId?: number | null;
  RFF?: string[] | null;
  SDOH?: string[] | null;
  sustainability: string;
  userId: string;
}

interface RequestData {
  userId: string;
  clientId: number;
  firstName: string;
  email: string;
  agencyId: number;
  details: string;
  SDOH: string[];
  RFF: string[];
  implementation: string;
  sustainability: string;
  funds: { amount: number; fundTypeId: number; needsReceipt: boolean }[];
}

interface FundTypeData {
  userId: string;
  typeName: string;
  needsReceipt: boolean;
}

type NewFundData = {
  requestId: number;
  fundTypeId: number;
  amount: number;
  needsReceipt: boolean;
};

interface AgencyData {
  userId: string;
  name: string;
}

interface PreScreenData {
  requestId: number;
  housingSituation: number;
  housingQuality: number;
  utilityStress: number;
  foodInsecurityStress: number;
  foodMoneyStress: number;
  transpoConfidence: number;
  transpoStress: number;
  financialDifficulties: number;
  additionalInformation: string;
}

interface PostScreenData {
  requestId: number;
  housingSituation: number;
  housingQuality: number;
  utilityStress: number;
  foodInsecurityStress: number;
  foodMoneyStress: number;
  transpoConfidence: number;
  transpoStress: number;
  financialDifficulties: number;
  additionalInformation: string;
}

type DepositData = {
  amount: number;
  totalValue: number;
  details: string;
  lastVersion: number;
  userId: string;
};

export async function createOperatingDeposit(
  OperatingDepositData: DepositData,
) {
  // Assuming DepositData is properly typed according to your form data
  const { userId, details, totalValue, lastVersion } = OperatingDepositData;

  // Create a new transaction with the details
  const transactionData: TablesInsert<"Transaction"> = {
    UserId: userId,
    details,
    totalValue,
    isDeposit: true,
    isCARES: true,
    // Add any other necessary fields
  };

  try {
    // Create the transaction
    await createTransaction(transactionData);

    // Update the operating balance
    const updatedBalance = await updateOperatingBalance(lastVersion, {
      availableBalance: totalValue,
      totalBalance: totalValue,
      // Assuming you want to add totalValue to the available balance
      // Include other necessary fields for updating the balance
    });

    // Check if the balance update was successful
    if (!updatedBalance) {
      // If the balance update fails, consider rolling back the transaction if necessary
      throw new Error("Failed to update operating balance. Please try again.");
    }
    revalidatePath("/admin/finances");
    // Return success or the updated balance/transaction details as needed
    return updatedBalance;
  } catch (error) {
    console.error("Error creating operating deposit:", error);
    // Handle error (e.g., rollback transaction, notify the user, etc.)
    throw error;
  }
}

export async function createRFFDeposit(RFFDepositData: DepositData) {
  // Assuming DepositData is properly typed according to your form data
  const { userId, details, totalValue, lastVersion } = RFFDepositData;

  // Create a new transaction with the details
  const transactionData: TablesInsert<"Transaction"> = {
    UserId: userId,
    details,
    totalValue,
    isDeposit: true,
    isRFF: true,
    // Add any other necessary fields
  };

  try {
    // Create the transaction
    await createTransaction(transactionData);

    // Update the operating balance
    const updatedBalance = await updateRFFBalance(lastVersion, {
      availableBalance: totalValue,
      totalBalance: totalValue,
      // Assuming you want to add totalValue to the available balance
      // Include other necessary fields for updating the balance
    });

    // Check if the balance update was successful
    if (!updatedBalance) {
      // If the balance update fails, consider rolling back the transaction if necessary
      throw new Error("Failed to update operating balance. Please try again.");
    }
    revalidatePath("/admin/finances");
    // Return success or the updated balance/transaction details as needed
    return updatedBalance;
  } catch (error) {
    console.error("Error creating operating deposit:", error);
    // Handle error (e.g., rollback transaction, notify the user, etc.)
    throw error;
  }
}

export async function createTransaction(
  transactionData: TablesInsert<"Transaction">,
) {
  const transaction = await createNewTransaction(transactionData);
  return transaction;
}

export async function createAsset(
  assetData: TablesInsert<"Asset"> & { amount: number },
) {
  // Extract the amount and remove it from the assetData object
  const { amount, ...dataWithoutAmount } = assetData;

  // Create an array to hold all promises for the insert operations
  const insertPromises = [];

  // Loop for the amount times to insert the asset records
  for (let i = 0; i < amount; i++) {
    insertPromises.push(createNewAsset(dataWithoutAmount));
  }

  // Use Promise.all to execute all insert operations concurrently
  try {
    const results = await Promise.all(insertPromises);
    return results; // This will be an array of all inserted asset records
  } catch (error) {
    console.error("Error creating assets:", error);
    throw error;
  }
}

export async function newAgency(agencyState: AgencyData) {
  if (!agencyState.userId) {
    throw new Error("User not authenticated");
  }
  const newAgencyRecord = await createAgency(agencyState);
  revalidatePath(`/admin/settings/page`);

  return newAgencyRecord;
}

export async function newFund(fundState: NewFundData) {
  console.log(fundState);
  if (!fundState.requestId || !fundState.amount || !fundState.fundTypeId) {
    throw new Error("Data incomplete");
  }
  const newFundRecord = await createNewFundByRequestId(fundState);

  const requestId = fundState.requestId;
  revalidatePath(`/admin/request/${requestId}/page`);
  return newFundRecord;
}

export async function newPreScreen(
  preScreenState: PreScreenData,
  requestId: number,
) {
  if (!requestId) {
    throw new Error(
      "Request ID is required to tie your prescreen to your request",
    );
  }
  try {
    await createPreScreen(preScreenState);
    revalidatePath("/admin/request/${requestId}");
    revalidatePath("/dashboard");
    revalidatePath("/user/requests");
    return true;
  } catch (error) {
    console.error("Failed to create new prescreen record:", error);
    throw error;
  }
}

export async function newPostScreen(
  postScreenState: PostScreenData,
  requestId: number,
  firstName: string,
  email: string,
) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  if (!requestId) {
    throw new Error(
      "Request ID is required to tie your post screen to your request",
    );
  }
  try {
    const newPostScreenRecord = await createPostScreen(postScreenState);
    revalidatePath("/admin/request/${requestId}");
    revalidatePath("/dashboard");
    revalidatePath("/user/requests");
    await resend.emails.send({
      from: "CARES <info@yolopublicdefendercares.org>",
      to: [email],
      subject: "Post-Screen Received!",
      react: CompletedEmailTemplate({
        firstName: firstName,
      }) as React.ReactElement,
    });
    return newPostScreenRecord;
  } catch (error) {
    console.error("Failed to create new postscreen record:", error);
    throw error;
  }
}

export async function newFundType(fundState: FundTypeData) {
  if (!fundState.userId) {
    throw new Error("User not authenticated");
  }
  const newFundTypeRecord = await createFundType(fundState);
  if (!newFundTypeRecord) {
    throw new Error("Failed to create fund type.");
  }
  return newFundTypeRecord;
}

export async function newClient(clientState: TablesInsert<"Client">) {
  if (!clientState.userId) {
    throw new Error("User not authenticated");
  }

  const newClientRecord = await createClient(clientState);
  revalidatePath("/dashboard");
  revalidatePath("/user/clients");
  return newClientRecord;
}

export async function newRequest(requestState: RequestData) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  if (!requestState.userId) {
    throw new Error("User not authenticated");
  }
  console.log("newRequest server action called with:", requestState);
  const requestData: RequestInsert = {
    agencyId: requestState.agencyId,
    clientId: requestState.clientId,
    details: requestState.details,
    implementation: requestState.implementation,
    sustainability: requestState.sustainability,
    RFF: requestState.RFF,
    SDOH: requestState.SDOH,
    userId: requestState.userId,
  };
  try {
    const newRequestRecord = await createRequest(requestData);
    console.log("Request created successfully with ID:", newRequestRecord.id);
    if (typeof newRequestRecord.id !== "number") {
      throw new Error("Request ID is undefined or not a number");
    }
    const requestId = newRequestRecord.id;
    const fundsData = requestState.funds.map((fund) => ({
      ...fund,
      requestId: requestId,
    }));
    const fundsRecords = await createFunds(fundsData);
    console.log("Funds created successfully:", fundsRecords);
    const anyFundsNeedReceipt = requestState.funds.some(
      (fund) => fund.needsReceipt,
    );
    if (anyFundsNeedReceipt) {
      await markRequestAsNeedingReceipt(requestId);
    } else {
      await markRequestAsNotNeedingReceipt(requestId);
    }
    await resend.emails.send({
      from: "CARES <help@yolopublicdefendercares.org>",
      to: [requestState.email],
      subject: "Your request has been submitted!",
      react: SubmittedEmailTemplate({
        firstName: requestState.firstName,
      }) as React.ReactElement,
    });
    revalidatePath(`/dashboard/page`);
    return { requestId, fundsRecords };
  } catch (error) {
    console.error("Failed to create request or funds:", error);
    throw error;
  }
}
