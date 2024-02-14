import {
  countPendingRequests,
  countCompletedRequests,
  countDeniedRequests,
  countRequestsByAgency,
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
