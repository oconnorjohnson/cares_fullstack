"use server";
import { createClient } from "@/prisma/prismaFunctions";
import { newClientFactory } from "@/server/form-factories";
import { currentUser } from "@clerk/nextjs";

interface ClientData {
  first_name: string;
  last_name: string;
  dateOfBirth: Date; // Already a Date object
  sex: string;
  race: string;
  userId: number;
  contactInfo?: string;
  caseNumber?: string;
}

// Adjust the function to directly accept an object matching the form's state
export async function newClient(clientState: ClientData) {
  // Fetch the current user
  const user = await currentUser();
  if (!user) {
    throw new Error("User not authenticated");
  }
  const userId = parseInt(user.id); // Convert to number to match the schema

  // No need to convert dateOfBirth, it's already a Date object
  // Validate form data using the factory
  const validationResult = await newClientFactory.validateFormData(clientState);
  if (validationResult && Object.keys(validationResult).length > 0) {
    console.error("Validation failed:", validationResult);
    // Construct a detailed error message
    const detailedErrorMessage = Object.entries(validationResult)
      .map(([field, message]) => `${field}: ${message}`)
      .join(", ");
    throw new Error(`Validation failed: ${detailedErrorMessage}`);
  }

  // The clientState already contains the correct types, including dateOfBirth as a Date object
  const clientData: ClientData = {
    ...clientState,
    userId: userId, // Add the userId from the authenticated user
  };

  // Call the createClient function with the prepared data
  const newClientRecord = await createClient(clientData);
  return newClientRecord;
}
