import {
  countPendingRequests,
  countCompletedRequests,
  countDeniedRequests,
  countRequestsByAgency,
  countOpenRequestsByUserId,
  countApprovedRequestsByUserId,
  countDeniedRequestsByUserId,
  countClientsByUserId,
  countAvailableRFFBusPasses,
  countReservedRFFBusPasses,
  countAvailableCARESBusPasses,
  countReservedCARESBusPasses,
  countRFFWalmartCards,
  countRFFArcoCards,
  countCARESWalmartCards,
  countCARESArcoCards,
} from "@/server/supabase/functions/count";
import { getAllAgencyIds } from "@/server/supabase/functions/read";
import { auth } from "@clerk/nextjs/server";

export async function CountRFFWalmartCards() {
  const { userId } = auth();
  if (!userId) {
    throw new Error("User not authenticated");
  }
  const walmartCards = await countRFFWalmartCards();
  console.log(walmartCards);
  return walmartCards;
}

export async function CountRFFArcoCards() {
  const { userId } = auth();
  if (!userId) {
    throw new Error("User not authenticated");
  }
  const arcoCards = await countRFFArcoCards();
  console.log(arcoCards);
  return arcoCards;
}

export async function CountCARESWalmartCards() {
  const { userId } = auth();
  if (!userId) {
    throw new Error("User not authenticated");
  }
  const walmartCards = await countCARESWalmartCards();
  console.log(walmartCards);
  return walmartCards;
}

export async function CountCARESArcoCards() {
  const { userId } = auth();
  if (!userId) {
    throw new Error("User not authenticated");
  }
  const arcoCards = await countCARESArcoCards();
  console.log(arcoCards);
  return arcoCards;
}

export async function CountAvailableRFFBusPasses() {
  const { userId } = auth();
  if (!userId) {
    throw new Error("User not authenticated");
  }
  const availableBusPasses = await countAvailableRFFBusPasses();
  console.log(availableBusPasses);
  return availableBusPasses;
}

export async function CountReservedRFFBusPasses() {
  const { userId } = auth();
  if (!userId) {
    throw new Error("User not authenticated");
  }
  const reservedBusPasses = await countReservedRFFBusPasses();
  console.log(reservedBusPasses);
  return reservedBusPasses;
}

export async function CountAvailableCARESBusPasses() {
  const { userId } = auth();
  if (!userId) {
    throw new Error("User not authenticated");
  }
  const availableBusPasses = await countAvailableCARESBusPasses();
  console.log(availableBusPasses);
  return availableBusPasses;
}

export async function CountReservedCARESBusPasses() {
  const { userId } = auth();
  if (!userId) {
    throw new Error("User not authenticated");
  }
  const reservedBusPasses = await countReservedCARESBusPasses();
  console.log(reservedBusPasses);
  return reservedBusPasses;
}

export async function CountRequestsPendingApproval() {
  const { userId } = auth();
  if (!userId) {
    throw new Error("User not authenticated");
  }
  const pendingRequests = await countPendingRequests();
  console.log(Error);
  return pendingRequests;
}

export async function CountClientsByUserId(userID: string) {
  const { userId } = auth();
  if (!userId) {
    throw new Error("User not authenticated");
  }
  const clients = await countClientsByUserId(userID);
  console.log(Error);
  return clients;
}

export async function CountRequestsCompleted() {
  const { userId } = auth();
  if (!userId) {
    throw new Error("User not authenticated");
  }
  const completedRequests = await countCompletedRequests();
  console.log(Error);
  return completedRequests;
}

export async function CountRequestsDenied() {
  const { userId } = auth();
  if (!userId) {
    throw new Error("User not authenticated");
  }
  const deniedRequests = await countDeniedRequests();
  console.log(Error);
  return deniedRequests;
}

export async function CountOpenRequestsByUserId(userID: string) {
  const { userId } = auth();
  if (!userId) {
    throw new Error("User not authenticated");
  }
  const openRequests = await countOpenRequestsByUserId(userID);
  console.log(Error);
  return openRequests;
}

export async function CountApprovedRequestsByUserId(userID: string) {
  const { userId } = auth();
  if (!userId) {
    throw new Error("User not authenticated");
  }
  const approvedRequests = await countApprovedRequestsByUserId(userID);
  console.log(Error);
  return approvedRequests;
}

export async function CountDeniedRequestsByUserId(userID: string) {
  const { userId } = auth();
  if (!userId) {
    throw new Error("User not authenticated");
  }
  const deniedRequests = await countDeniedRequestsByUserId(userID);
  console.log(Error);
  return deniedRequests;
}
