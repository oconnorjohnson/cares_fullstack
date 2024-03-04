"use server";
import {
  createClient,
  createFundType,
  createAgency,
  createRequest,
  createPreScreen,
  createPostScreen,
  createNewFundByRequestId,
} from "@/prisma/prismaFunctions";

import { Submitted } from "@/server/actions/resend/actions";
import { EmailTemplate as SubmittedEmailTemplate } from "@/components/emails/submitted";
import { EmailTemplate as CompletedEmailTemplate } from "@/components/emails/completed";
import { Resend } from "resend";
import { revalidatePath } from "next/cache";

interface ClientData {
  first_name: string;
  last_name: string;
  dateOfBirth: Date;
  sex: string;
  race: string;
  userId: string;
  contactInfo?: string;
  caseNumber?: string;
}

interface RequestData {
  userId: string;
  clientId: number;
  firstName: string;
  email: string;
  agencyId: number;
  details: string;
  sdoh: string[];
  rff: string[];
  implementation: string;
  sustainability: string;
  funds: { amount: number; fundTypeId: number }[];
}

interface FundTypeData {
  userId: string;
  typeName: string;
}

type NewFundData = {
  requestId: number;
  fundTypeId: number;
  amount: number;
};

interface AgencyData {
  userId: string;
  name: string;
}

interface PreScreenData {
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

export async function newAgency(agencyState: AgencyData) {
  if (!agencyState.userId) {
    throw new Error("User not authenticated");
  }
  const newAgencyRecord = await createAgency(agencyState);
  revalidatePath(`/admin/settings/page`);
  if (!newAgencyRecord) {
    throw new Error("Failed to create new agency.");
  }
  return newAgencyRecord;
}

export async function newFund(fundState: NewFundData) {
  console.log(fundState);
  if (!fundState.requestId || !fundState.amount || !fundState.fundTypeId) {
    throw new Error("Data incomplete");
  }
  const newFundRecord = await createNewFundByRequestId(fundState);
  if (!newFundRecord) {
    throw new Error("Failed to create a new fund.");
  }
  const requestId = fundState.requestId;
  await revalidatePath(`/admin/request/${requestId}/page`);
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
    const newPreScreenRecord = await createPreScreen(preScreenState, requestId);
    revalidatePath("/admin/request/${requestId}");
    revalidatePath("/dashboard");
    revalidatePath("/user/requests");
    return newPreScreenRecord;
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
    const newPostScreenRecord = await createPostScreen(
      postScreenState,
      requestId,
    );
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

export async function newClient(clientState: ClientData) {
  if (!clientState.userId) {
    throw new Error("User not authenticated");
  }
  // Server-side validation (example)
  if (clientState.first_name.length < 2) {
    throw new Error("First name must be at least 2 characters.");
  }
  const newClientRecord = await createClient(clientState);
  if (!newClientRecord) {
    throw new Error("Failed to create client.");
  }
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
  const hasInvalidFunds = requestState.funds.some(
    (fund) => !fund.fundTypeId || fund.fundTypeId <= 0,
  );
  if (hasInvalidFunds) {
    throw new Error("Each fund must have a valid fund type.");
  }
  try {
    const newRequestRecord = await createRequest(requestState);
    await resend.emails.send({
      from: "CARES <help@yolopublicdefendercares.org>",
      to: [requestState.email],
      subject: "Your request has been submitted!",
      react: SubmittedEmailTemplate({
        firstName: requestState.firstName,
      }) as React.ReactElement,
    });
    await revalidatePath(`/dashboard/page`);
    console.log("Request created successfully:", newRequestRecord);
    return newRequestRecord;
  } catch (error) {
    console.error("Failed to create request:", error);
    throw error;
  }
}
