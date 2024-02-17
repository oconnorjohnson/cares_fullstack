import {
  countPendingRequests,
  countCompletedRequests,
  countDeniedRequests,
  countRequestsByAgency,
  countOpenRequestsByUserId,
} from "@/prisma/prismaFunctions";
import { revalidatePath } from "next/cache";

export async function CountRequestsPendingApproval() {
  const pendingRequests = await countPendingRequests();
  return pendingRequests;
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
