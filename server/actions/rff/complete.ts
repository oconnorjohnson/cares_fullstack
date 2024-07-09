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

// update balance with expended invoice (money out of total and reserved, available remains the same)
// expend the asset (reserved => expended)
// create transaction to reflect the change in balance ( like createFundDisubrsementTransaction on actions/rff/paid.ts)

export async function completeRequest(
  requestId: number,
  UserId: string,
): Promise<boolean> {
  const { userId: clerkuserId } = auth();
  if (!clerkuserId) {
    throw new Error("User not authenticated");
  }
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
      const expendInvoice = await expendInvoiceFromRFFBalance(fund.id, fund);
      if (expendInvoice) {
        await createInvoiceDisbursementTransaction(fund, requestId, UserId);
        await updateRequestCompleted(requestId);
      }
    }
    return true;
  } catch (error) {
    console.error("Error in completeRequest:", error);
    throw error;
  }
}
