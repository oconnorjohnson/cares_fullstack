"use server";
import {
  createClient,
  createFundType,
  createAgency,
  createRequest,
} from "@/prisma/prismaFunctions";

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

interface AgencyData {
  userId: string;
  name: string;
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
  try {
    const newRequestRecord = await createRequest(requestState);
    console.log("Request created successfully:", newRequestRecord);
    return newRequestRecord;
  } catch (error) {
    console.error("Failed to create request:", error);
    throw error;
  }
}
