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
import {
  getFundTypeNeedsReceiptById,
  getOperatingBalance,
  getRFFBalance,
} from "@/server/supabase/functions/read";
import {
  updateOperatingBalance,
  updateRFFBalance,
} from "@/server/supabase/functions/update";
import { deleteTransaction } from "@/server/supabase/functions/delete";
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

export async function addBusPasses({
  amount,
  UserId,
  balanceSource,
}: {
  amount: number;
  UserId: string;
  balanceSource: string;
}) {
  const unitValue = 2.5;
  const totalValue = amount * unitValue;
  let transactionId: number | undefined;
  let currentBalance;
  let lastVersion;
  let balanceUpdated: boolean = false;

  try {
    // Step 1: Get the current balance and version number
    if (balanceSource === "CARES") {
      currentBalance = await getOperatingBalance();
    } else if (balanceSource === "RFF") {
      currentBalance = await getRFFBalance();
    }

    if (!currentBalance) {
      throw new Error("Failed to retrieve current balance.");
    }

    // Assuming currentBalance object has availableBalance and version properties
    if (currentBalance[0].availableBalance < totalValue) {
      throw new Error("Insufficient funds to complete this transaction.");
    }

    lastVersion = currentBalance[0].version;

    // Step 2: Create the transaction
    const transactionData = {
      quantity: amount,
      unitValue: unitValue,
      totalValue: totalValue,
      isPurchase: true,
      isCARES: balanceSource === "CARES",
      isRFF: balanceSource === "RFF",
      UserId: UserId,
    };

    const createdTransaction = await createTransaction(transactionData);
    if (!createdTransaction) {
      throw new Error("Failed to create transaction.");
    }
    const transactionId = createdTransaction;
    console.log("Created transaction with ID:", transactionId);
    // Step 3: Update balance with the lastVersion
    try {
      const balanceUpdateData = {
        availableBalance: -totalValue, // Pass as negative to subtract
        totalBalance: -totalValue, // Pass as negative to subtract
        reservedBalance: 0,
      };

      if (balanceSource === "CARES") {
        await updateOperatingBalance(lastVersion, balanceUpdateData);
      } else if (balanceSource === "RFF") {
        await updateRFFBalance(lastVersion, balanceUpdateData);
      }
      balanceUpdated = true;
    } catch (error) {
      if (balanceUpdated === false) {
        throw new Error("Failed to update balance.");
      }
      console.error("Error in addBusPasses:", error);
      throw error; // Rethrow the error to be handled by the caller
    }

    if (!transactionId) {
      throw new Error("No transaction ID, failed to create asset records.");
    }
    // Step 3: Create asset records
    const assetPromises = [];
    for (let i = 0; i < amount; i++) {
      assetPromises.push(
        createNewAsset({
          UserId: UserId,
          FundTypeId: 3, // Integer for Bus Pass fund type id
          isAvailable: true,
          TransactionId: transactionId,
          totalValue: unitValue,
          isRFF: balanceSource === "RFF",
          isCARES: balanceSource === "CARES",
        }),
      );
    }

    try {
      await Promise.all(assetPromises);
      // Since createAsset now only throws on error, no need to check return values
    } catch (error) {
      console.error("Error in addBusPasses:", error);
      // Handle error, such as rolling back transactions if necessary
      throw error;
    }
  } catch (error) {
    console.error("Error in addBusPasses:", error);

    // // Attempt to rollback if necessary
    // if (transactionId) {
    //   // Delete the transaction
    //   await deleteTransaction(transactionId); // Assuming you have a function to delete a transaction
    // }

    // // If balance was updated, revert the balance update
    // if (
    //   balanceUpdated === true &&
    //   currentBalance &&
    //   lastVersion !== undefined
    // ) {
    //   const revertBalanceUpdate =
    //     balanceSource === "CARES" ? updateOperatingBalance : updateRFFBalance;
    //   try {
    //     await revertBalanceUpdate(lastVersion, {
    //       availableBalance: currentBalance[0].availableBalance,
    //       totalBalance: currentBalance[0].totalBalance,
    //       // Include other necessary fields for reverting the balance
    //     });
    //   } catch (revertError) {
    //     console.error("Failed to revert balance update:", revertError);
    //     // Handle the error of reverting the balance (e.g., log it, notify someone, etc.)
    //   }
    // }

    throw error; // Rethrow the error to be handled by the caller
  }
}

export async function createBusPassAssets(
  assetData: TablesInsert<"Asset"> & { amount: number },
) {
  // Extract the amount and remove it from the assetData object
  const { amount, ...dataWithoutAmount } = assetData;

  // Define the totalValue for each asset
  const totalValue = 2.5;

  // Create an array to hold all promises for the insert operations
  const insertPromises = [];

  // Loop for the amount times to insert the asset records
  for (let i = 0; i < amount; i++) {
    // Add the totalValue to each asset record
    const assetRecord = { ...dataWithoutAmount, totalValue };
    insertPromises.push(createNewAsset(assetRecord));
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
