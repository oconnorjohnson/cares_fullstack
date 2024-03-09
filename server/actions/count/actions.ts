import {
  countPendingRequests,
  countCompletedRequests,
  countDeniedRequests,
  countRequestsByAgency,
  countOpenRequestsByUserId,
  countApprovedRequestsByUserId,
  countDeniedRequestsByUserId,
  countClientsByUserId,
} from "@/server/supabase/functions/count";
import { getAllAgencyIds } from "@/server/supabase/functions/read";

export async function CountRequestsPendingApproval() {
  const pendingRequests = await countPendingRequests();
  if (!pendingRequests) {
    throw new Error("Failed to count pending requests.");
  }
  return pendingRequests;
}

export async function CountClientsByUserId(userId: string) {
  const clients = await countClientsByUserId(userId);
  if (!clients) {
    throw new Error("Failed to count clients by user ID.");
  }
  return clients;
}

export async function CountRequestsCompleted() {
  const completedRequests = await countCompletedRequests();
  if (!completedRequests) {
    throw new Error("Failed to count completed requests.");
  }
  return completedRequests;
}

export async function CountRequestsDenied() {
  const deniedRequests = await countDeniedRequests();
  if (!deniedRequests) {
    throw new Error("Failed to count denied requests.");
  }
  return deniedRequests;
}

export async function CountRequestsByAgency() {
  const { data: agencyData, error: agencyError } = await getAllAgencyIds();
  if (agencyError) {
    throw new Error(`Failed to get agency IDs: ${agencyError}`);
  }
  if (!agencyData) {
    throw new Error("No agency data found.");
  }

  const results = [];

  for (const agency of agencyData) {
    const { count } = await countRequestsByAgency(agency.id);
    results.push({ agencyId: agency.id, agencyName: agency.name, count });
  }

  return results;
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
