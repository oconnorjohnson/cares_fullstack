"use server";
import { revalidatePath } from "next/cache";
import { Resend } from "resend";
import { auth } from "@clerk/nextjs/server";

import { EmailTemplate as ApprovedEmailTemplate } from "@/components/emails/approved";

import {
  getRFFWalmartCards,
  getRFFArcoCards,
  getRFFBusPasses,
  getRFFBalance,
} from "@/server/supabase/functions/read";
import {
  markAssetAsReserved,
  updateFundWithAssets,
  updateRFFBalance,
  approveRequestById,
  markRequestHasInvoice,
} from "@/server/supabase/functions/update";
import { createTransaction } from "@/server/supabase/functions/create";
import { GetFundsByRequestId } from "@/server/actions/request/actions";
import { markRequestAsNeedingReceipt } from "@/server/actions/update/actions";

import type {
  FundDetail,
  FundTypeHandlers,
  FundTypeTransactionHandlers,
} from "@/server/actions/rff/types";

const fundTypeHandlers: FundTypeHandlers = {
  1: reserveWalmartGiftCard,
  2: reserveArcoGiftCard,
  3: reserveBusPass,
  4: reserveFunds,
  5: reserveFunds,
  6: reserveFunds,
};

const fundTypeTransactionHandlers: FundTypeTransactionHandlers = {
  1: createWalmartGiftCardTransaction,
  2: createArcoGiftCardTransaction,
  3: createBusPassTransaction,
  4: createFundReservationTransaction,
  5: createFundReservationTransaction,
  6: createFundReservationTransaction,
};

async function reserveWalmartGiftCard(fund: FundDetail) {
  let assetIdsToReserve: number[] = [];
  const walmartCards = await getRFFWalmartCards();
  const matchedCard = walmartCards.find(
    (card) => card.totalValue === fund.amount,
  );
  if (!matchedCard) {
    throw new Error(`Walmart gift card amount ${fund.amount} not found.`);
  }
  assetIdsToReserve = [matchedCard.id];
  const reservationSuccess = await markAssetAsReserved(matchedCard.id, fund.id);
  if (!reservationSuccess) {
    throw new Error(
      `Failed to reserve Walmart gift card with ID ${matchedCard.id}.`,
    );
  }
  if (assetIdsToReserve.length > 0) {
    await updateFundWithAssets(fund.id, assetIdsToReserve);
    console.log(
      "Updating fund with fundId with assetIds:",
      fund.id,
      assetIdsToReserve,
    );
  }
  console.log(
    `Successfully reserved Walmart gift card with ID ${matchedCard.id}.`,
  );
  return reservationSuccess;
}

async function createWalmartGiftCardTransaction(
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
    isReservation: true,
  };
  await createTransaction(walmartTransactionData);
  console.log(
    `Transaction created for Walmart Gift Card with fund ID ${fund.id}`,
  );
  return true;
}

async function reserveArcoGiftCard(fund: FundDetail): Promise<boolean> {
  let assetIdsToReserve: number[] = [];
  const arcoCards = await getRFFArcoCards();
  const matchedCard = arcoCards.find((card) => card.totalValue === fund.amount);
  if (!matchedCard) {
    throw new Error(`Arco gift card amount ${fund.amount} not found.`);
  }
  assetIdsToReserve = [matchedCard.id];
  const reservationSuccess = await markAssetAsReserved(matchedCard.id, fund.id);
  if (!reservationSuccess) {
    throw new Error(
      `Failed to reserve Arco gift card with ID ${matchedCard.id}.`,
    );
  }
  if (assetIdsToReserve.length > 0) {
    await updateFundWithAssets(fund.id, assetIdsToReserve);
    console.log(
      "Updating fund with fundId with assetIds:",
      fund.id,
      assetIdsToReserve,
    );
  }
  console.log(
    `Successfully reserved Arco gift card with ID ${matchedCard.id}.`,
  );
  return true;
}

async function createArcoGiftCardTransaction(
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
    isReservation: true,
  };
  await createTransaction(arcoTransactionData);
  console.log(`Transaction created for Arco Gift Card with fund ID ${fund.id}`);
  return true;
}

async function reserveBusPass(fund: FundDetail): Promise<boolean> {
  let assetIdsToReserve: number[] = [];
  const availableBusPasses = await getRFFBusPasses();
  if (!availableBusPasses) {
    throw new Error("Failed to fetch available bus passes.");
  }
  if (fund.amount > availableBusPasses.length) {
    throw new Error(
      `Requested number of bus passes exceeds available stock. Available: ${availableBusPasses}, Requested: ${fund.amount}`,
    );
  }
  const busPassIdsToReserve = availableBusPasses
    .slice(-fund.amount)
    .map((pass) => pass.id);
  const reservedPromises = busPassIdsToReserve.map((bussPassId) =>
    markAssetAsReserved(bussPassId, fund.id),
  );
  assetIdsToReserve = busPassIdsToReserve;
  try {
    await Promise.all(reservedPromises);
  } catch (error) {
    console.error("error in marking assets as reserved", error);
    throw new Error("error in marking assets as reserved");
  }
  if (assetIdsToReserve.length > 0) {
    await updateFundWithAssets(fund.id, assetIdsToReserve);
    console.log(
      "Updating fund with fundId with assetIds:",
      fund.id,
      assetIdsToReserve,
    );
  }
  console.log(
    `Successfully reserved ${busPassIdsToReserve.length} bus passes.`,
  );
  return true;
}

async function createBusPassTransaction(
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
    isReservation: true,
  };
  await createTransaction(busPassTransactionData);
  console.log(`Transaction created for bus pass with fund ID ${fund.id}`);
  return true;
}

async function reserveFunds(fund: FundDetail): Promise<boolean> {
  const currentRFFBalanceData = await getRFFBalance();
  if (!currentRFFBalanceData || currentRFFBalanceData.length === 0) {
    throw new Error("Failed to fetch RFFBalance data.");
  }
  const { version } = currentRFFBalanceData[0];
  const rffBalanceUpdateData = {
    reservedBalance: fund.amount,
    availableBalance: -fund.amount,
    totalBalance: 0,
    lastVersion: version,
  };
  const updateSuccess = await updateRFFBalance(version, rffBalanceUpdateData);
  if (!updateSuccess) {
    throw new Error("Failed to update RFFBalance.");
  } else {
    return true;
  }
}

async function createFundReservationTransaction(
  fund: FundDetail,
  requestId: number,
  UserId: string,
): Promise<boolean> {
  const fundReservationTransactionData = {
    FundTypeId: fund.fundTypeId,
    quantity: 1,
    unitValue: fund.amount,
    totalValue: fund.amount,
    RequestId: requestId,
    UserId: UserId,
    isRFF: true,
    isReservation: true,
  };
  await createTransaction(fundReservationTransactionData);
  console.log(`Transaction created for fund with fund ID ${fund.id}`);
  return true;
}

export default async function ApproveRFFRequest(
  requestId: number,
  firstName: string,
  email: string,
  UserId: string,
) {
  const { userId: clerkuserId } = auth();
  if (!clerkuserId) {
    throw new Error("User not authenticated");
  }
  console.log("ApproveRFFRequest function called");
  const resend = new Resend(process.env.RESEND_API_KEY);

  let modifiedFunds: FundDetail[] = [];
  console.log("Fetching funds associated with request");
  const funds = await GetFundsByRequestId(requestId);
  modifiedFunds = funds.map(({ id, fundTypeId, amount, AssetIds }) => ({
    id: id,
    fundTypeId,
    amount,
    AssetIds: AssetIds,
  }));
  console.log(modifiedFunds);

  if (modifiedFunds.some((fund) => fund.fundTypeId === 5)) {
    await markRequestHasInvoice(requestId);
  }

  const processFund = async (
    fund: FundDetail,
    requestId: number,
    UserId: string,
  ) => {
    const reservationHandler = fundTypeHandlers[fund.fundTypeId];
    const transactionHandler = fundTypeTransactionHandlers[fund.fundTypeId];
    if (!reservationHandler || !transactionHandler) {
      throw new Error("Invalid fundTypeId");
    }
    await reservationHandler(fund);
    console.log(`Reservation successful for fund ID ${fund.id}`);
    await transactionHandler(fund, requestId, UserId);
    console.log(`Transaction successful for fund ID ${fund.id}`);
  };

  try {
    // Approve the request first
    await approveRequestById(requestId);
    console.log("Request approved successfully");

    // Then process the funds and reserve assets
    for (const fund of modifiedFunds) {
      await processFund(fund, requestId, UserId);
    }
    console.log("Successfully processed funds");
  } catch (error) {
    console.error("Error processing funds:", error);
    throw error;
  }

  try {
    // Handle receipts if needed
    if (funds.some((fund) => fund.needsReceipt === true)) {
      await markRequestAsNeedingReceipt(requestId);
    }
    revalidatePath("/admin/requests/[requestid]");
    await resend.emails.send({
      from: "CARES <info@yolocountycares.com>",
      to: [email],
      subject: "Your request has been approved.",
      react: ApprovedEmailTemplate({
        firstName: firstName,
      }) as React.ReactElement,
    });
    console.log("Approval email sent successfully");
  } catch (error) {
    console.error("Error sending approval email:", error);
  }
}
