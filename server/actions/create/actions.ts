"use server";
import {
  createClient,
  createFundType,
  createAgency,
  createRequest,
  createPreScreen,
  createNewFundByRequestId,
} from "@/prisma/prismaFunctions";
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

export async function newAgency(agencyState: AgencyData) {
  if (!agencyState.userId) {
    throw new Error("User not authenticated");
  }
  const newAgencyRecord = await createAgency(agencyState);
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
    return newPreScreenRecord;
  } catch (error) {
    console.error("Failed to create new prescreen record:", error);
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
  return newClientRecord;
}

export async function newRequest(requestState: RequestData) {
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
    console.log("Request created successfully:", newRequestRecord);
    return newRequestRecord;
  } catch (error) {
    console.error("Failed to create request:", error);
    throw error;
  }
}
