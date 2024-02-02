"use server";
import { createClient } from "@/prisma/prismaFunctions";

interface ClientData {
  first_name: string;
  last_name: string;
  dateOfBirth: Date; // Already a Date object
  sex: string;
  race: string;
  userId: string;
  contactInfo?: string;
  caseNumber?: string;
}

export async function newClient(clientState: ClientData) {
  if (!clientState.userId) {
    throw new Error("User not authenticated");
  }

  // Server-side validation (example)
  if (clientState.first_name.length < 2) {
    throw new Error("First name must be at least 2 characters.");
  }

  // Assuming createClient handles the insertion and returns the created record
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

  const newRequestRecord = await createRequest(requestState);

  if (!newRequestRecord) {
    throw new Error("Failed to submit request.");
  }

  return newRequestRecord;
}
