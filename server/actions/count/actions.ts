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

export async function CountRFFWalmartCards() {
  const walmartCards = await countRFFWalmartCards();
  console.log(walmartCards);
  return walmartCards;
}

export async function CountRFFArcoCards() {
  const arcoCards = await countRFFArcoCards();
  console.log(arcoCards);
  return arcoCards;
}

export async function CountCARESWalmartCards() {
  const walmartCards = await countCARESWalmartCards();
  console.log(walmartCards);
  return walmartCards;
}

export async function CountCARESArcoCards() {
  const arcoCards = await countCARESArcoCards();
  console.log(arcoCards);
  return arcoCards;
}

export async function CountAvailableRFFBusPasses() {
  const availableBusPasses = await countAvailableRFFBusPasses();
  console.log(availableBusPasses);
  return availableBusPasses;
}

export async function CountReservedRFFBusPasses() {
  const reservedBusPasses = await countReservedRFFBusPasses();
  console.log(reservedBusPasses);
  return reservedBusPasses;
}

export async function CountAvailableCARESBusPasses() {
  const availableBusPasses = await countAvailableCARESBusPasses();
  console.log(availableBusPasses);
  return availableBusPasses;
}

export async function CountReservedCARESBusPasses() {
  const reservedBusPasses = await countReservedCARESBusPasses();
  console.log(reservedBusPasses);
  return reservedBusPasses;
}

export async function CountRequestsPendingApproval() {
  const pendingRequests = await countPendingRequests();
  console.log(Error);
  return pendingRequests;
}

export async function CountClientsByUserId(userId: string) {
  const clients = await countClientsByUserId(userId);
  console.log(Error);
  return clients;
}

export async function CountRequestsCompleted() {
  const completedRequests = await countCompletedRequests();
  console.log(Error);
  return completedRequests;
}

export async function CountRequestsDenied() {
  const deniedRequests = await countDeniedRequests();
  console.log(Error);
  return deniedRequests;
}

// export async function CountRequestsByAgency() {
//   const { data: agencyData, error: agencyError } = await getAllAgencyIds();
//   const results = [];
//   for (const agency of agencyData) {
//     const { count } = await countRequestsByAgency(agency.id);
//     results.push({ agencyId: agency.id, agencyName: agency.name, count });
//   }
//   return results;
// }

export async function CountOpenRequestsByUserId(userId: string) {
  const openRequests = await countOpenRequestsByUserId(userId);
  console.log(Error);
  return openRequests;
}

export async function CountApprovedRequestsByUserId(userId: string) {
  const approvedRequests = await countApprovedRequestsByUserId(userId);
  console.log(Error);
  return approvedRequests;
}

export async function CountDeniedRequestsByUserId(userId: string) {
  const deniedRequests = await countDeniedRequestsByUserId(userId);
  console.log(Error);
  return deniedRequests;
}
