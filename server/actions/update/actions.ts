"use server";

import {
  denyRequestById,
  approveRequestById,
  updateFundById,
  markRequestPaidById,
  banUserById,
  requestNeedsReceipt,
  requestDoesNotNeedReceipt,
  updateOperatingBalance as updateTheOperatingBalance,
  updateRFFBalance as updateTheRFFBalance,
  markAssetAsReserved,
  markAssetAsExpended,
} from "@/server/supabase/functions/update";
import { GetFundsByRequestId } from "@/server/actions/request/actions";
import {
  getFundsByRequestId,
  getRFFWalmartCards,
  getRFFArcoCards,
  getRFFBalance,
  getReservedRFFArcoCards,
  getReservedRFFWalmartCards,
  getReservedRFFBusPasses,
  getRFFBusPasses,
} from "@/server/supabase/functions/read";
import { createTransaction } from "@/server/supabase/functions/create";
import { countAvailableRFFBusPasses } from "@/server/supabase/functions/count";
import { revalidatePath } from "next/cache";
import { Resend } from "resend";
import { EmailTemplate as PaidEmailTemplate } from "@/components/emails/paid";
import { EmailTemplate as ReceiptUploadedEmailTemplate } from "@/components/emails/receipt-uploaded";
import { EmailTemplate as BannedEmailTemplate } from "@/components/emails/banned";
import { EmailTemplate as ApprovedEmailTemplate } from "@/components/emails/approved";
import { EmailTemplate as DeniedEmailTemplate } from "@/components/emails/denied";
import { TablesUpdate } from "@/types_db";
import { calculateSizeAdjustValues } from "next/dist/server/font-utils";

export interface RequestData {
  id: number;
  details: string;
  pendingApproval: boolean;
  approved: boolean;
  denied: boolean;
  pendingPayout: boolean;
  paid: boolean;
  hasPreScreen: boolean;
  hasPostScreen: boolean;
  createdAt: Date;
}

export interface UserData {
  userId: string;
  isBanned: boolean;
}

export interface FundDetail {
  id: number;
  fundTypeId: number;
  amount: number;
}

export interface BalanceUpdateData {
  availableBalance: number;
  last_updated: string;
  reservedBalance: number;
  totalBalance: number;
  TransactionId: number | null;
  version: number;
  lastVersion: number;
}

export async function revalidateDashboard() {
  revalidatePath("/dashboard");
}

export async function revalidateUserRequests() {
  revalidatePath("/user/requests");
}

export async function updateOperatingBalance(
  lastVersion: number,
  operatingBalanceData: TablesUpdate<"OperatingBalance">,
) {
  const operatingBalance = await updateTheOperatingBalance(
    lastVersion,
    operatingBalanceData,
  );
  return operatingBalance;
}

export async function updateRFFBalance(
  lastVersion: number,
  rffBalanceData: TablesUpdate<"RFFBalance">,
) {
  const rffBalance = await updateTheRFFBalance(lastVersion, rffBalanceData);
  return rffBalance;
}

export async function sendReceiptEmail(firstname: string, email: string) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  await resend.emails.send({
    from: "CARES <info@yolopublicdefendercares.org>",
    to: [email],
    subject: "Receipt Uploaded!",
    react: ReceiptUploadedEmailTemplate({
      firstName: firstname,
    }) as React.ReactElement,
  });
  revalidatePath("/dashboard");
  revalidatePath("/user/requests");
}
export async function markRequestAsNeedingReceipt(requestId: number) {
  try {
    await requestNeedsReceipt(requestId);
    revalidatePath("/dashboard");
    revalidatePath("/user/requests");
    return true;
  } catch (error) {
    console.error("Error marking request as needing receipt:", error);
    throw error;
  }
}
export async function markRequestAsNotNeedingReceipt(requestId: number) {
  try {
    await requestDoesNotNeedReceipt(requestId);
    revalidatePath("/dashboard");
    revalidatePath("/user/requests");
    return true;
  } catch (error) {
    console.error("Error marking request as not needing receipt:", error);
    throw error;
  }
}
export async function BanUser(
  userId: string,
  firstName: string,
  email: string,
): Promise<UserData> {
  const resend = new Resend(process.env.RESEND_API_KEY);
  try {
    const response = await banUserById(userId);
    if (response.error) {
      throw new Error(response.error.message);
    }
    const updatedUser = response.data;
    if (!updatedUser) {
      throw new Error("Failed to update user data.");
    }
    await resend.emails.send({
      from: "CARES <info@yolopublicdefendercares.org>",
      to: [email],
      subject: "You have been banned from submitting requests to CARES",
      react: BannedEmailTemplate({
        firstName: firstName,
      }) as React.ReactElement,
    });
    revalidatePath(`/dashboard/page`);
    console.log(firstName, email);
    return updatedUser;
  } catch (error) {
    console.error(`Failed to ban user with ID ${userId}:`, error);
    throw error;
  }
}

export async function DenyRequest(
  requestId: number,
  firstName: string,
  email: string,
): Promise<RequestData> {
  const resend = new Resend(process.env.RESEND_API_KEY);
  try {
    const response = await denyRequestById(requestId);
    const updatedRequest = response.data;
    revalidatePath(`/admin/request/${requestId}/page`);
    revalidatePath(`/dashboard/page`);
    await resend.emails.send({
      from: "CARES <info@yolopublicdefendercares.org>",
      to: [email],
      subject: "Your request has been denied.",
      react: DeniedEmailTemplate({
        firstName: firstName,
      }) as React.ReactElement,
    });
    return updatedRequest as unknown as RequestData;
  } catch (error) {
    console.error(`Failed to deny request with ID ${requestId}:`, error);
    throw error;
  }
}

export async function ApproveRequest(
  requestId: number,
  firstName: string,
  email: string,
  UserId: string,
): Promise<RequestData> {
  const resend = new Resend(process.env.RESEND_API_KEY);
  let modifiedFunds: FundDetail[] = [];
  try {
    // 1. Fetch the funds associated with the request
    try {
      console.log("Fetching funds associated with request");
      const funds = await GetFundsByRequestId(requestId);
      modifiedFunds = funds.map(({ id, fundTypeId, amount }) => ({
        id: id,
        fundTypeId,
        amount,
      }));
      console.log(modifiedFunds);
    } catch (error) {
      console.error("Error in Step 1 of ApproveRequest:", error);
      throw error;
    }
    // 2. Check the requested funds against the available RFF assets and RFF balance
    try {
      console.log(
        "Checking requested funds against available RFF assets and RFF balance",
      );
      for (const fund of modifiedFunds) {
        switch (fund.fundTypeId) {
          // Step 2 Case 1: fundTypeId = 1 (Walmart Gift Card)
          case 1:
            const walmartCards = await getRFFWalmartCards();
            const walmartCardAmounts = walmartCards.map(
              (card: { totalValue: number }) => card.totalValue,
            );
            if (!walmartCardAmounts.includes(fund.amount)) {
              throw new Error("Gift card amount not found");
            }
            console.log("Gift card amount found");
            break;
          // Step 2 Case 2: fundTypeId = 2 (Arco Gift Card)
          case 2:
            const arcoCards = await getRFFArcoCards();
            const arcoCardAmounts = arcoCards.map(
              (card: { totalValue: number }) => card.totalValue,
            );
            if (!arcoCardAmounts.includes(fund.amount)) {
              throw new Error("Gift card amount not found");
            }
            console.log("Gift card amount found");
            break;
          // Step 2 Case 3: fundTypeId = 3 (Bus Pass)
          case 3: {
            const availableBusPasses = await countAvailableRFFBusPasses();
            if (fund.amount > availableBusPasses!) {
              throw new Error(
                `Requested number of bus passes exceeds available stock. Available: ${availableBusPasses}, Requested: ${fund.amount}`,
              );
            }
            console.log("Bus pass amount found");
            break;
          }
          // Step 2 Case 4/5/6:fundTypeId = 4 (Cash), 5 (Invoice), 6 (Check)
          case 4:
          case 5:
          case 6:
            const rffBalance = await getRFFBalance();
            if (fund.amount > rffBalance[0].availableBalance) {
              throw new Error(
                `Requested amount exceeds available balance. Available: ${rffBalance[0].availableBalance}, Requested: ${fund.amount}`,
              );
            }
            console.log("RFF balance amount found");
            break;
          default:
            console.error("invalid fundTypeId", fund.fundTypeId);
            throw new Error("invalid fundTypeId");
        }
      }
    } catch (error) {
      console.error("Error in Step 2 of ApproveRequest:", error);
      throw error;
    }
    // 3. if all checks passed, then we mark each fund's asset or balance amount as reserved in assets and RFFBalance.
    try {
      for (const fund of modifiedFunds) {
        switch (fund.fundTypeId) {
          // Step 3 case 1: fundTypeId = 1 (Walmart Gift Card)
          case 1:
            const walmartCards = await getRFFWalmartCards();
            const matchingCard = walmartCards.find(
              (card) => card.totalValue === fund.amount,
            );
            if (!matchingCard) {
              console.error("Gift card amount not found");
              throw new Error("Gift card amount not found");
            }
            const reservedCard = await markAssetAsReserved(
              matchingCard.id,
              fund.id,
            );
            if (!reservedCard) {
              console.error("Error marking asset as reserved");
              throw new Error("Error marking asset as reserved");
            }
            break;
          // Step 3 Case 2: fundTypeId = 2 (Arco Gift Card)
          case 2:
            const arcoCards = await getRFFArcoCards();
            const matchedCard = arcoCards.find(
              (card) => card.totalValue === fund.amount,
            );
            if (!matchedCard) {
              console.error("Gift card amount not found");
              throw new Error("Gift card amount not found");
            }
            const reserveCard = await markAssetAsReserved(
              matchedCard.id,
              fund.id,
            );
            if (!reserveCard) {
              console.error("Error marking asset as reserved");
              throw new Error("Error marking asset as reserved");
            }
            break;
          // Step 3 Case 3: fundTypeId = 3 (Bus Pass)
          case 3: {
            const availableBusPasses = await getRFFBusPasses();
            if (fund.amount > availableBusPasses.length) {
              throw new Error(
                `Not enough bus passes available. Available: ${availableBusPasses.length}, Requested: ${fund.amount}`,
              );
            }
            const busPassIdsToReserve = availableBusPasses
              .slice(-fund.amount)
              .map((pass) => pass.id);
            const reservedPromises = busPassIdsToReserve.map((bussPassId) =>
              markAssetAsReserved(bussPassId, fund.id),
            );
            try {
              await Promise.all(reservedPromises);
            } catch (error) {
              console.error("error in marking assets as reserved", error);
              throw new Error("error in marking assets as reserved");
            }
            break;
          }
          // Step 3 Case 4/5/6:fundTypeId = 4 (Cash), 5 (Invoice), 6 (Check)
          case 4:
          case 5:
          case 6:
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
            const updateSuccess = await updateRFFBalance(
              version,
              rffBalanceUpdateData,
            );
            if (!updateSuccess) {
              throw new Error("Failed to update RFFBalance.");
            }
            break;
          default:
            console.error("invalid fundTypeId", fund.fundTypeId);
            throw new Error("invalid fundTypeId");
        }
      }
    } catch (error) {
      console.error("Error in Step 2 of ApproveRequest:", error);
      throw error;
    }
    // 4. We create a transaction for each fund that reflects the change in balance or asset availability.
    try {
      for (const fund of modifiedFunds) {
        switch (fund.fundTypeId) {
          // Step 4 case 1: fundTypeId = 1 (Walmart Gift Card)
          case 1:
            try {
              const walmartTransactionData = {
                FundTypeId: 1,
                quantity: 1,
                unitValue: fund.amount, // Corrected from unitvalue to unitValue
                totalValue: fund.amount,
                RequestId: requestId,
                UserId: UserId,
                isRFF: true,
                isReservation: true,
              };
              await createTransaction(walmartTransactionData);
            } catch (error) {
              console.error(
                `Error creating Walmart gift card transaction for fund ID ${fund.id}:`,
                error,
              );
              throw new Error(
                `Failed to create transaction for Walmart gift card with fund ID ${fund.id}`,
              );
            }
            break;
          case 2:
            try {
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
            } catch (error) {
              console.error(
                `Error creating Arco gift card transaction for fund ID ${fund.id}:`,
                error,
              );
              throw new Error(
                `Failed to create transaction for Arco gift card with fund ID ${fund.id}`,
              );
            }
            break;
          case 3:
            try {
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
            } catch (error) {
              console.error(
                `Error creating bus pass transaction for fund ID ${fund.id}:`,
                error,
              );
              throw new Error(
                `Failed to create transaction for bus passes with fund ID ${fund.id}`,
              );
            }
            break;
          // Step 4 Case 4/5/6:fundTypeId = 4 (Cash), 5 (Invoice), 6 (Check)
          case 4:
          case 5:
          case 6:
            try {
              const rffBalanceTransactionData = {
                FundTypeId: fund.fundTypeId,
                quantity: 1,
                unitValue: fund.amount,
                totalValue: fund.amount,
                RequestId: requestId,
                UserId: UserId,
                isRFF: true,
                isReservation: true,
              };
              await createTransaction(rffBalanceTransactionData);
            } catch (error) {
              console.error(
                `Error creating RFF balance transaction for fund ID ${fund.id}:`,
                error,
              );
              throw new Error(
                `Failed to create transaction for RFF balance with fund ID ${fund.id}`,
              );
            }
            break;
          default:
            console.error("invalid fundTypeId", fund.fundTypeId);
            throw new Error("invalid fundTypeId");
        }
      }
    } catch (error) {
      console.error("Error in Step 2 of ApproveRequest:", error);
      throw error;
    }
    // 5. The request is marked as approved, and the user is notified of the approval.
    try {
      const response = await approveRequestById(requestId);
      const updatedRequest = response;
      const funds = await getFundsByRequestId(requestId);
      if (funds.some((fund) => fund.needsReceipt === true)) {
        await markRequestAsNeedingReceipt(requestId);
      }
      revalidatePath(`/admin/request/${requestId}/page`);
      revalidatePath(`/dashboard/page`);
      await resend.emails.send({
        from: "CARES <info@yolopublicdefendercares.org>",
        to: [email],
        subject: "Your request has been approved.",
        react: ApprovedEmailTemplate({
          firstName: firstName,
        }) as React.ReactElement,
      });
      return updatedRequest as unknown as RequestData;
    } catch (error) {
      console.error(`Failed to approve request with ID ${requestId}:`, error);
      throw error;
    }
  } catch (error) {
    console.error("Error in Step 2 of ApproveRequest:", error);
    throw error;
  }
}
// 1. we need to get the array of funds that are associated with the request
// 2. depending on the fundTypeId, we fire the appropriate server function to mark the asset as expended and remove the totalAmount from reservedBalance as well as totalBalance
// 3. On success, we create a transaction for each fund that reflects the change in balance or asset availability, and the request is marked as paid.
export async function MarkPaid(
  requestId: number,
  firstName: string,
  email: string,
  UserId: string,
): Promise<TablesUpdate<"Request">> {
  const resend = new Resend(process.env.RESEND_API_KEY);
  let modifiedFunds: FundDetail[] = [];
  try {
    // 1. Fetch the funds associated with the request
    try {
      const funds = await GetFundsByRequestId(requestId);
      modifiedFunds = funds.map(({ id, fundTypeId, amount }) => ({
        id: id,
        fundTypeId,
        amount,
      }));
    } catch (error) {
      throw error;
    }
    // 2. Mark each fund's asset or balance amount as expended in assets and subtracted from reservedBalance and totalBalance of the RFFBalance.
    try {
      for (const fund of modifiedFunds) {
        switch (fund.fundTypeId) {
          // Step 3 case 1: fundTypeId = 1 (Walmart Gift Card)
          case 1:
            const walmartCards = await getReservedRFFWalmartCards();
            const matchingCard = walmartCards.find(
              (card) => card.totalValue === fund.amount,
            );
            if (!matchingCard) {
              console.error("Gift card amount not found");
              throw new Error("Gift card amount not found");
            }
            const reservedCard = await markAssetAsExpended(
              matchingCard.id,
              fund.id,
            );
            if (!reservedCard) {
              console.error("Error marking asset as reserved");
              throw new Error("Error marking asset as reserved");
            }
            break;
          // Step 3 Case 2: fundTypeId = 2 (Arco Gift Card)
          case 2:
            const arcoCards = await getReservedRFFArcoCards();
            const matchedCard = arcoCards.find(
              (card) => card.totalValue === fund.amount,
            );
            if (!matchedCard) {
              console.error("Gift card amount not found");
              throw new Error("Gift card amount not found");
            }
            const reserveCard = await markAssetAsExpended(
              matchedCard.id,
              fund.id,
            );
            if (!reserveCard) {
              console.error("Error marking asset as reserved");
              throw new Error("Error marking asset as reserved");
            }
            break;
          // Step 3 Case 3: fundTypeId = 3 (Bus Pass)
          case 3: {
            const availableBusPasses = await getRFFBusPasses();
            if (fund.amount > availableBusPasses.length) {
              throw new Error(
                `Not enough bus passes available. Available: ${availableBusPasses.length}, Requested: ${fund.amount}`,
              );
            }
            const busPassIdsToReserve = availableBusPasses
              .slice(-fund.amount)
              .map((pass) => pass.id);
            const reservedPromises = busPassIdsToReserve.map((bussPassId) =>
              markAssetAsExpended(bussPassId, fund.id),
            );
            try {
              await Promise.all(reservedPromises);
            } catch (error) {
              console.error("error in marking assets as reserved", error);
              throw new Error("error in marking assets as reserved");
            }
            break;
          }
          // Step 3 Case 4/5/6:fundTypeId = 4 (Cash), 5 (Invoice), 6 (Check)
          case 4:
          case 5:
          case 6:
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
            const updateSuccess = await updateRFFBalance(
              version,
              rffBalanceUpdateData,
            );
            if (!updateSuccess) {
              throw new Error("Failed to update RFFBalance.");
            }
            break;
          default:
            console.error("invalid fundTypeId", fund.fundTypeId);
            throw new Error("invalid fundTypeId");
        }
      }
    } catch (error) {
      console.error("Error in Step 2 of ApproveRequest:", error);
      throw error;
    }
    // 3. Create a transaction for each fund
    try {
      for (const fund of modifiedFunds) {
        switch (fund.fundTypeId) {
          // Step 4 case 1: fundTypeId = 1 (Walmart Gift Card)
          case 1:
            try {
              const walmartTransactionData = {
                FundTypeId: 1,
                quantity: 1,
                unitValue: fund.amount, // Corrected from unitvalue to unitValue
                totalValue: fund.amount,
                RequestId: requestId,
                UserId: UserId,
                isRFF: true,
                isReservation: false,
                isDisbursement: true,
              };
              await createTransaction(walmartTransactionData);
            } catch (error) {
              console.error(
                `Error creating Walmart gift card transaction for fund ID ${fund.id}:`,
                error,
              );
              throw new Error(
                `Failed to create transaction for Walmart gift card with fund ID ${fund.id}`,
              );
            }
            break;
          case 2:
            try {
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
            } catch (error) {
              console.error(
                `Error creating Arco gift card transaction for fund ID ${fund.id}:`,
                error,
              );
              throw new Error(
                `Failed to create transaction for Arco gift card with fund ID ${fund.id}`,
              );
            }
            break;
          case 3:
            try {
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
            } catch (error) {
              console.error(
                `Error creating bus pass transaction for fund ID ${fund.id}:`,
                error,
              );
              throw new Error(
                `Failed to create transaction for bus passes with fund ID ${fund.id}`,
              );
            }
            break;
          // Step 4 Case 4/5/6:fundTypeId = 4 (Cash), 5 (Invoice), 6 (Check)
          case 4:
          case 5:
          case 6:
            try {
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
            } catch (error) {
              console.error(
                `Error creating RFF balance transaction for fund ID ${fund.id}:`,
                error,
              );
              throw new Error(
                `Failed to create transaction for RFF balance with fund ID ${fund.id}`,
              );
            }
            break;
          default:
            console.error("invalid fundTypeId", fund.fundTypeId);
            throw new Error("invalid fundTypeId");
        }
      }
    } catch (error) {
      throw error;
    }
    // 4. Finally, mark Request as Paid and notify user
    try {
      const response = await markRequestPaidById(requestId);
      const updatedRequest = response;
      if (!updatedRequest) {
        throw new Error("Failed to update request data.");
      }
      revalidatePath(`/admin/request/${requestId}/page`);
      revalidatePath(`/dashboard/page`);
      await resend.emails.send({
        from: "CARES <info@yolopublicdefendercares.org>",
        to: [email],
        subject: "Your request has been paid.",
        react: PaidEmailTemplate({
          firstName: firstName,
        }) as React.ReactElement,
      });
      return updatedRequest as unknown as TablesUpdate<"Request">;
    } catch (error) {
      console.error(
        `Failed to mark request with ID ${requestId} as paid:`,
        error,
      );
      throw error;
    }
  } catch (error) {
    console.error(
      `Failed to mark request with ID ${requestId} as paid:`,
      error,
    );
    throw error;
  }
}

export async function UpdateFund(
  fundId: number,
  fundTypeId: number,
  amount: number,
  requestId: number,
  needsReceipt: boolean,
): Promise<TablesUpdate<"Fund">> {
  const fundData = {
    id: fundId,
    amount: amount,
    fundTypeId: fundTypeId,
    requestId: requestId,
    needsReceipt: needsReceipt,
  };
  console.log(
    `Calling UpdateFund with Fund ID: ${fundId}, Request ID: ${requestId}, Amount: ${amount}, Fund Type ID: ${fundTypeId}, needsReceipt: ${needsReceipt}`,
  );
  try {
    console.log(
      `Before updateFundById - Fund ID: ${fundId}, Fund Type ID: ${fundTypeId}, Amount: ${amount}`,
    );
    const response = await updateFundById(fundData);
    const updatedFund = response;
    console.log(`Successfully updated fund with ID: ${fundId}`);
    revalidatePath(`/admin/request/${requestId}/page`);
    return updatedFund as unknown as TablesUpdate<"Fund">;
  } catch (error) {
    console.error(`Failed to update fund with ID ${fundId}:`, error);
    throw error;
  }
}
