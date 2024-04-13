"use server";
import { revalidatePath } from "next/cache";

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

import type {
  FundDetail,
  ExpendTypeHandlers,
  FundTypeTransactionHandlers,
} from "@/server/actions/rff/types";

async function expendWalmartGiftCard(
  asset: number | null,
  fundId: number,
  fund: FundDetail,
): Promise<boolean> {
  const expended = await markAssetAsExpended(asset!, fundId);
  if (!expended) {
    console.error(
      `Error marking Walmart gift card (Asset ID: ${asset}) as expended`,
    );
    throw new Error(
      `Error marking Walmart gift card (Asset ID: ${asset}) as expended`,
    );
  }
  console.log(`Walmart gift card with fund ID ${fundId} marked as expended.`);
  return true;
}

async function expendArcoGiftCard(
  asset: number | null,
  fundId: number,
  fund: FundDetail,
): Promise<boolean> {
  const expended = await markAssetAsExpended(asset!, fundId);
  if (!expended) {
    console.error(
      `Error marking Arco gift card (Asset ID: ${asset}) as expended`,
    );
    throw new Error(
      `Error marking Arco gift card (Asset ID: ${asset}) as expended`,
    );
  }
  console.log(`Arco gift card with fund ID ${fundId} marked as expended.`);
  return true;
}

async function expendBusPass(
  asset: number | null,
  fundId: number,
  fund: FundDetail,
): Promise<boolean> {
  const expended = await markAssetAsExpended(asset!, fundId);
  if (!expended) {
    console.error(`Error marking bus pass (Asset ID: ${asset}) as expended`);
    throw new Error(`Error marking bus pass (Asset ID: ${asset}) as expended`);
  }
  console.log(`Bus pass with fund ID ${fundId} marked as expended.`);
  return true;
}

async function expendFunds(
  asset: number | null,
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
  }
  console.log(`Other fund with fund ID ${fundId} marked as expended.`);
  return true;
}

async function createWalmartDisbursementTransaction(
  fund: FundDetail,
  requestId: number,
  UserId: string,
): Promise<boolean> {
  const walmartTransactionData = {
    FundTypeId: 1,
    quantity: 1,
    unitValue: fund.amount,
    totalValue: fund.amount,
    RequestId: requestId,
    UserId: UserId,
    isRFF: true,
    isReservation: false,
    isDisbursement: true,
  };
  await createTransaction(walmartTransactionData);
  console.log(
    `Disbursement transaction created for Walmart Gift Card with fund ID ${fund.id}`,
  );
  return true;
}

async function createArcoDisbursementTransaction(
  fund: FundDetail,
  requestId: number,
  UserId: string,
): Promise<boolean> {
  const arcoTransactionData = {
    FundTypeId: 2,
    quantity: 1,
    unitValue: fund.amount,
    totalValue: fund.amount,
    RequestId: requestId,
    UserId: UserId,
    isRFF: true,
    isReservation: false,
    isDisbursement: true,
  };
  await createTransaction(arcoTransactionData);
  console.log(
    `Disbursement transaction created for Arco Gift Card with fund ID ${fund.id}`,
  );
  return true;
}

async function createBusPassDisbursementTransaction(
  fund: FundDetail,
  requestId: number,
  UserId: string,
): Promise<boolean> {
  const busPassTransactionData = {
    FundTypeId: 3,
    quantity: fund.amount,
    unitValue: 2.5,
    totalValue: fund.amount * 2.5,
    RequestId: requestId,
    UserId: UserId,
    isRFF: true,
    isReservation: false,
    isDisbursement: true,
  };
  await createTransaction(busPassTransactionData);
  console.log(
    `Disbursement transaction created for bus pass with fund ID ${fund.id}`,
  );
  return true;
}

async function createFundDisbursementTransaction(
  fund: FundDetail,
  requestId: number,
  UserId: string,
): Promise<boolean> {
  const rffBalanceTransactionData = {
    FundTypeId: fund.fundTypeId,
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
  console.log(
    `Disbursement transaction created for other fund with fund ID ${fund.id}`,
  );
  return true;
}

const expendHandlers: ExpendTypeHandlers = {
  1: expendWalmartGiftCard,
  2: expendArcoGiftCard,
  3: expendBusPass,
  4: expendFunds,
  // removed fund type 5 from handling in paid flow
  6: expendFunds,
};

const transactionHandlers: FundTypeTransactionHandlers = {
  1: createWalmartDisbursementTransaction,
  2: createArcoDisbursementTransaction,
  3: createBusPassDisbursementTransaction,
  4: createFundDisbursementTransaction,
  // removed fund type 5 from handling in paid flow
  6: createFundDisbursementTransaction,
};

export default async function MarkPaid(requestId: number, UserId: string) {
  let modifiedFunds: FundDetail[] = [];
  try {
    const funds = await GetFundsByRequestId(requestId);
    // Filter out funds with fundTypeId of 5
    modifiedFunds = funds
      .filter(({ fundTypeId }) => fundTypeId !== 5)
      .map(({ id, fundTypeId, amount, AssetIds }) => ({
        id: id,
        fundTypeId,
        amount,
        AssetIds: AssetIds,
      }));
    try {
      for (const fund of modifiedFunds) {
        const expendHandler = expendHandlers[fund.fundTypeId];
        if (!expendHandler) {
          console.error("Invalid fundTypeId:", fund.fundTypeId);
          throw new Error("Invalid fundTypeId");
        }
        if (fund.AssetIds && fund.AssetIds.length > 0) {
          console.log("AssetIds", fund.AssetIds);
          for (const asset of fund.AssetIds) {
            await expendHandler(asset, fund.id, fund);
            console.log(`Processed fund ID ${fund.id} successfully.`);
          }
        } else if ([4, 6].includes(fund.fundTypeId)) {
          await expendHandler(null, fund.id, fund);
          console.log(`Processed fund ID ${fund.id} successfully.`);
        }
        const transactionHandler = transactionHandlers[fund.fundTypeId];
        if (!transactionHandler) {
          console.error("Invalid fundTypeId for transaction:", fund.fundTypeId);
          throw new Error("Invalid fundTypeId for transaction");
        }
        await transactionHandler(fund, requestId, UserId);
        console.log(`Request ID ${requestId} marked as paid.`);
      }
    } catch (error) {
      console.error("Error in MarkPaid function:", error);
      throw error;
    }
    try {
      await markRequestPaidById(requestId);
      const needsReceipt = funds.some((fund) => fund.needsReceipt === true);
      if (needsReceipt) {
        await markRequestAsNeedingReceipt(requestId);
      } else {
        await markRequestAsNotNeedingReceipt(requestId);
      }
      const hasInvoice = await doesRequestHaveInvoice(requestId);
      if (!hasInvoice) {
        await updateRequestCompleted(requestId);
      }
      revalidatePath("/admin/requests/[requestid]");
    } catch (error) {
      console.error("Error in MarkPaid function:", error);
      throw error;
    }
  } catch (error) {
    throw error;
  }
}
