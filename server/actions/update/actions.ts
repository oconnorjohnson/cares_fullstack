"use server";

import {
  denyRequestById,
  updateFundById,
  banUserById,
  requestNeedsReceipt,
  requestDoesNotNeedReceipt,
  updateOperatingBalance as updateTheOperatingBalance,
  updateRFFBalance as updateTheRFFBalance,
  updateAdminEmailPreference,
  updateRequestAdminColumn,
  setAllAdminColumnsNull,
  updateNewsCard,
} from "@/server/supabase/functions/update";
import {
  isAdminOneNull,
  isAdminTwoNull,
  isAdminThreeNull,
} from "@/server/supabase/functions/read";
import {
  sendRFFBalanceUpdatedAdminEmails,
  sendCARESBalanceUpdatedAdminEmails,
} from "@/server/actions/email-events/admin";
import { revalidatePath } from "next/cache";
import { Resend } from "resend";

import { EmailTemplate as ReceiptUploadedEmailTemplate } from "@/components/emails/receipt-uploaded";
import { EmailTemplate as BannedEmailTemplate } from "@/components/emails/banned";
import { EmailTemplate as DeniedEmailTemplate } from "@/components/emails/denied";

import type { updateRequestAdminColumnData } from "@/server/supabase/functions/update";
import type { TablesUpdate } from "@/types_db";

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
  adminOne: string | null;
  adminTwo: string | null;
  adminThree: string | null;
}

export interface UserData {
  userId: string;
  isBanned: boolean;
}

export interface FundDetail {
  id: number;
  fundTypeId: number;
  amount: number;
  AssetIds?: number[];
}
type AdminEmailPreference = {
  agreementUploaded: boolean;
  caresAssetsAdded: boolean;
  caresBalanceUpdated: boolean;
  id: number;
  postCompleted: boolean;
  receiptUploaded: boolean;
  requestReceived: boolean;
  rffAssetsAdded: boolean;
  rffBalanceUpdated: boolean;
};
export interface BalanceUpdateData {
  availableBalance: number;
  last_updated: string;
  reservedBalance: number;
  totalBalance: number;
  TransactionId: number | null;
  version: number;
  lastVersion: number;
}

export async function updateNewsCards(
  NewsCardId: number,
  cardTitle: string,
  cardDescription: string,
  cardContent: string,
) {
  const updateSuccess = await updateNewsCard(
    NewsCardId,
    cardTitle,
    cardDescription,
    cardContent,
  );
  revalidatePath("/dashboard");
  return updateSuccess;
}

export async function updateAdminEmailPrefs(
  emailPreference: AdminEmailPreference,
) {
  const updateSuccess = await updateAdminEmailPreference(emailPreference);
  return updateSuccess;
}

export async function revalidateDashboard() {
  revalidatePath("/dashboard");
}

export async function revalidateUserRequests() {
  revalidatePath("/user/requests");
}

export async function addAdminAgreementToRequest({
  requestId,
  userId,
}: {
  requestId: number;
  userId: string;
}) {
  try {
    if (await isAdminOneNull(requestId)) {
      const updateData = { columnName: "adminOne", userId, requestId };
      return await updateRequestAdminColumn(updateData);
    } else if (await isAdminTwoNull(requestId)) {
      const updateData = { columnName: "adminTwo", userId, requestId };
      return await updateRequestAdminColumn(updateData);
    } else if (await isAdminThreeNull(requestId)) {
      const updateData = { columnName: "adminThree", userId, requestId };
      return await updateRequestAdminColumn(updateData);
    } else {
      throw new Error("All admin columns are already filled.");
    }
  } catch (error) {
    console.error("Error adding admin agreement to request:", error);
    throw error;
  } finally {
    revalidatePath(`/admin/requests/[requestid]`);
  }
}

export async function updateOperatingBalance(
  lastVersion: number,
  operatingBalanceData: TablesUpdate<"OperatingBalance">,
) {
  const operatingBalance = await updateTheOperatingBalance(
    lastVersion,
    operatingBalanceData,
  );
  await sendCARESBalanceUpdatedAdminEmails();
  return operatingBalance;
}

export async function updateRFFBalance(
  lastVersion: number,
  rffBalanceData: TablesUpdate<"RFFBalance">,
) {
  const rffBalance = await updateTheRFFBalance(lastVersion, rffBalanceData);
  await sendRFFBalanceUpdatedAdminEmails();
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
    const setAdminColumnsNull = await setAllAdminColumnsNull(requestId);
    if (!setAdminColumnsNull) {
      throw new Error("Failed to set all admin columns to null");
    }
    console.log(`Successfully updated fund with ID: ${fundId}`);
    revalidatePath(`/admin/request/${requestId}/page`);
    return updatedFund as unknown as TablesUpdate<"Fund">;
  } catch (error) {
    console.error(`Failed to update fund with ID ${fundId}:`, error);
    throw error;
  }
}
