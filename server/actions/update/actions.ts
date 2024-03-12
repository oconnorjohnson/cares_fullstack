"use server";

import {
  denyRequestById,
  approveRequestById,
  updateFundById,
  markRequestPaidById,
  banUserById,
  requestNeedsReceipt,
} from "@/server/supabase/functions/update";
import { revalidatePath } from "next/cache";
import { Resend } from "resend";
import { EmailTemplate as PaidEmailTemplate } from "@/components/emails/paid";
import { EmailTemplate as ReceiptUploadedEmailTemplate } from "@/components/emails/receipt-uploaded";
import { EmailTemplate as BannedEmailTemplate } from "@/components/emails/banned";
import { EmailTemplate as ApprovedEmailTemplate } from "@/components/emails/approved";
import { EmailTemplate as DeniedEmailTemplate } from "@/components/emails/denied";
import { Tables, TablesUpdate } from "@/types_db";

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

export async function revalidateDashboard() {
  revalidatePath("/dashboard");
}

export async function revalidateUserRequests() {
  revalidatePath("/user/requests");
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
    if (response.error) {
      throw new Error(response.error.message);
    }
    const updatedRequest = response.data; // Extract the data from the response

    // Ensure updatedRequest is not null and matches RequestData interface
    if (!updatedRequest) {
      throw new Error("Failed to update request data.");
    }
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
    return updatedRequest;
  } catch (error) {
    console.error(`Failed to deny request with ID ${requestId}:`, error);
    throw error;
  }
}

export async function ApproveRequest(
  requestId: number,
  firstName: string,
  email: string,
): Promise<RequestData> {
  const resend = new Resend(process.env.RESEND_API_KEY);
  try {
    const response = await approveRequestById(requestId);
    if (response.error) {
      throw new Error(response.error.message);
    }
    const updatedRequest = response.data;
    if (!updatedRequest) {
      throw new Error("Failed to update request data.");
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
    return updatedRequest;
  } catch (error) {
    console.error(`Failed to approve request with ID ${requestId}:`, error);
    throw error;
  }
}

export async function MarkPaid(
  requestId: number,
  firstName: string,
  email: string,
): Promise<TablesUpdate<"Request">> {
  const resend = new Resend(process.env.RESEND_API_KEY);
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
}

export async function UpdateFund(
  fundId: number,
  fundTypeId: number,
  amount: number,
  requestId: number,
): Promise<TablesUpdate<"Fund">> {
  const fundData = {
    id: fundId,
    amount: amount,
    fundTypeId: fundTypeId,
    requestId: requestId,
  };
  console.log(
    `Calling UpdateFund with Fund ID: ${fundId}, Request ID: ${requestId}, Amount: ${amount}, Fund Type ID: ${fundTypeId}`,
  );
  try {
    console.log(
      `Before updateFundById - Fund ID: ${fundId}, Fund Type ID: ${fundTypeId}, Amount: ${amount}`,
    );
    const response = await updateFundById(fundData);
    const updatedFund = response;
    if (!updatedFund) {
      throw new Error("Failed to update fund data.");
    }
    console.log(`Successfully updated fund with ID: ${fundId}`);
    revalidatePath(`/admin/request/${requestId}/page`);
    return updatedFund as unknown as TablesUpdate<"Fund">;
  } catch (error) {
    console.error(`Failed to update fund with ID ${fundId}:`, error);
    throw error;
  }
}
