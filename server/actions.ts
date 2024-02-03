"use server";
import { createClient } from "@/prisma/prismaFunctions";
// import { createRequest } from "@/prisma/prismaFunctions";
import { createFundType } from "@/prisma/prismaFunctions";

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
  agency: string;
  details: string;
  sdoh: string[];
  rff: string[];
  implementation: string;
  means: string[];
  amount: string;
}

interface FundTypeData {
  userId: string;
  typeName: string;
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

// export async function newRequest(requestState: RequestData) {
//   if (!requestState.userId) {
//     throw new Error("User not authenticated");
//   }

//   const newRequestRecord = await createRequest(requestState);

//   if (!newRequestRecord) {
//     throw new Error("Failed to submit request.");
//   }

//   return newRequestRecord;
// }
