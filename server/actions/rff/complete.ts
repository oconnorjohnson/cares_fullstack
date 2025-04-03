"use server";

import {
  markAssetAsExpended,
  updateRFFBalance,
  markRequestPaidById,
  updateRequestCompleted,
} from "@/server/supabase/functions/update";
import { createTransaction } from "@/server/supabase/functions/create";
import {
  getRFFBalance,
  doesRequestHaveInvoice,
} from "@/server/supabase/functions/read";
import { GetFundsByRequestId } from "@/server/actions/request/actions";
import {
  markRequestAsNeedingReceipt,
  markRequestAsNotNeedingReceipt,
} from "@/server/actions/update/actions";
import { auth } from "@clerk/nextjs/server";
import { CompleteRequestFormData } from "@/server/schemas/complete-request";

import type {
  FundDetail,
  ExpendTypeHandlers,
  FundTypeTransactionHandlers,
} from "@/server/actions/rff/types";

async function expendInvoiceFromRFFBalance(
  fundId: number,
  fund: FundDetail,
): Promise<boolean> {
  const currentRFFBalanceData = await getRFFBalance();
  if (!currentRFFBalanceData || currentRFFBalanceData.length === 0) {
    throw new Error("Failed to fetch RFFBalance data.");
  }
  const { version } = currentRFFBalanceData[0];
  const rffBalanceUpdateData = {
    reservedBalance: -fund.amount,
    availableBalance: 0,
    totalBalance: -fund.amount,
    lastVersion: version,
  };
  const updateSuccess = await updateRFFBalance(version, rffBalanceUpdateData);
  if (!updateSuccess) {
    throw new Error("Failed to update RFFBalance.");
  } else {
    console.log("RFFBalance updated successfully");
    return true;
  }
}

async function createInvoiceDisbursementTransaction(
  fund: FundDetail,
  requestId: number,
  UserId: string,
): Promise<boolean> {
  const rffBalanceTransactionData = {
    FundTypeId: 5,
    quantity: 1,
    unitValue: fund.amount,
    totalValue: fund.amount,
    RequestId: requestId,
    UserId: UserId,
    isRFF: true,
    isReservation: false,
    isDisbursement: true,
  };
  await createTransaction(rffBalanceTransactionData);
  console.log(`Transaction created for RFF Balance with fund ID ${fund.id}`);
  return true;
}

async function adjustAvailableBalance(
  fundId: number,
  amountDifference: number,
): Promise<boolean> {
  const currentRFFBalanceData = await getRFFBalance();
  if (!currentRFFBalanceData || currentRFFBalanceData.length === 0) {
    throw new Error("Failed to fetch RFFBalance data.");
  }

  const { version } = currentRFFBalanceData[0];
  const rffBalanceUpdateData = {
    reservedBalance: 0, // No change to reserved since it's already been cleared
    availableBalance: amountDifference, // Add back to available if positive, subtract if negative
    totalBalance: amountDifference, // Also adjust total balance by the difference
    lastVersion: version,
  };

  const updateSuccess = await updateRFFBalance(version, rffBalanceUpdateData);
  if (!updateSuccess) {
    throw new Error("Failed to update RFFBalance.");
  }
  return true;
}

// update balance with expended invoice (money out of total and reserved, available remains the same)
// expend the asset (reserved => expended)
// create transaction to reflect the change in balance ( like createFundDisubrsementTransaction on actions/rff/paid.ts)

export async function completeRequest(
  data: CompleteRequestFormData,
): Promise<boolean> {
  const { userId: clerkuserId } = auth();
  if (!clerkuserId) {
    throw new Error("User not authenticated");
  }

  const { requestId, adjustedAmount, originalAmount, userId } = data;
  const amountDifference = originalAmount - adjustedAmount;

  let modifiedFunds: FundDetail[] = [];
  const funds = await GetFundsByRequestId(requestId);
  modifiedFunds = funds
    .filter(({ fundTypeId }) => fundTypeId === 5)
    .map(({ id, fundTypeId, amount }) => ({
      id: id,
      fundTypeId,
      amount,
    }));

  try {
    for (const fund of modifiedFunds) {
      // Expend the adjusted amount from the balance
      const expendInvoice = await expendInvoiceFromRFFBalance(fund.id, {
        ...fund,
        amount: adjustedAmount,
      });

      if (expendInvoice) {
        // Create transaction with adjusted amount
        await createInvoiceDisbursementTransaction(
          { ...fund, amount: adjustedAmount },
          requestId,
          userId,
        );

        // If there's a difference between original and adjusted, update available balance
        if (amountDifference !== 0) {
          await adjustAvailableBalance(fund.id, amountDifference);
        }

        await updateRequestCompleted(requestId);
      }
    }
    return true;
  } catch (error) {
    console.error("Error in completeRequest:", error);
    throw error;
  }
}
