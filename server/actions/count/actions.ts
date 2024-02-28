import {
  countPendingRequests,
  countCompletedRequests,
  countDeniedRequests,
  countRequestsByAgency,
  countOpenRequestsByUserId,
  countApprovedRequestsByUserId,
  countDeniedRequestsByUserId,
  countClientsByUserId,
} from "@/prisma/prismaFunctions";
import { revalidatePath } from "next/cache";

export async function CountRequestsPendingApproval() {
  const pendingRequests = await countPendingRequests();
  return pendingRequests;
}

export async function CountClientsByUserId(userId: string) {
  const clients = await countClientsByUserId(userId);
  return clients;
}

export async function CountRequestsCompleted() {
  const completedRequests = await countCompletedRequests();
  return completedRequests;
}

export async function CountRequestsDenied() {
  const deniedRequests = await countDeniedRequests();
  return deniedRequests;
}

export async function CountRequestsByAgency() {
  const requestsByAgency = await countRequestsByAgency();
  return requestsByAgency;
}

export async function CountOpenRequestsByUserId(userId: string) {
  const openRequests = await countOpenRequestsByUserId(userId);
  return openRequests;
}

export async function CountApprovedRequestsByUserId(userId: string) {
  const approvedRequests = await countApprovedRequestsByUserId(userId);
  return approvedRequests;
}

export async function CountDeniedRequestsByUserId(userId: string) {
  const deniedRequests = await countDeniedRequestsByUserId(userId);
  return deniedRequests;
}
