"use server";

import { auth } from "@clerk/nextjs/server";
import {
  getClientsByUserId,
  getAdminRequests,
  getRequestById,
  getAllRequests,
  getRequestsByUserId,
  getAgencyNameById,
  getUsers,
  getFunds,
  getFundsByRequestId,
  getAllAgencies,
  getFundTypes,
  getRequestsNeedingPreScreenByUserId,
  getRequestsNeedingReceiptsByUserId,
  getRequestsNeedingPostScreenByUserId,
  getClientByClientId,
  getRequestsThatNeedAgreementsByUserId,
  getOperatingBalance,
  getRFFBalance,
  getTransactions,
  getRFFArcoCards,
  getAdminEmailPreferenceByUserId,
  getAdminEmailPreferenceById,
  getTomorrowsPickupEvents,
  getTodaysPickupEvents,
  getUserByUserId,
  getRFFWalmartCards,
  getNewsCardOne as getNewsCardOneFromSupabase,
  getNewsCardTwo as getNewsCardTwoFromSupabase,
  getNewsCardThree as getNewsCardThreeFromSupabase,
  hasAdminAgreed as hasAdminAgreedFromSupabase,
  isAdminOneNull as isAdminOneNullFromSupabase,
  isAdminTwoNull as isAdminTwoNullFromSupabase,
  isAnyNull as isAnyNullFromSupabase,
  getAllFundTypes,
  getAllFunds,
} from "@/server/supabase/functions/read";
import { Tables } from "@/types_db";
import { PostgrestError } from "@supabase/supabase-js";

export type FundTypeData = {
  typeName: string;
  userId: string;
};
export type FundData = {
  amount: number;
  fundType: { typeName: string; userId: string } | null;
  request: { id: number };
};
export type Request = {
  id: number;
  userId: string;
  Client: {
    sex: string;
    race: string;
    clientID: string;
  } | null;
  User: {
    first_name: string | null;
    last_name: string | null;
  } | null;
  Agency: {
    name: string;
  } | null;
  details: string;
  pendingApproval: boolean;
  approved: boolean;
  denied: boolean;
  pendingPayout: boolean;
  paid: boolean;
  hasPreScreen: boolean;
  hasPostScreen: boolean;
  created_at: string;
  isHighlighted?: boolean;
  adminOne: string | null;
  adminTwo: string | null;
  adminThree: string | null;
};
export type Requests = {
  id: number;
  userId: string;
  Client: {
    sex: string;
    race: string;
    clientID: string;
  } | null;
  User: {
    first_name: string | null;
    last_name: string | null;
  } | null;
  Agency: {
    name: string;
  } | null;
  details: string;
  pendingApproval: boolean;
  approved: boolean;
  denied: boolean;
  pendingPayout: boolean;
  paid: boolean;
  hasPreScreen: boolean;
  hasPostScreen: boolean;
  created_at: string;
  isHighlighted?: boolean;
  adminOne: string | null;
  adminTwo: string | null;
  adminThree: string | null;
  funds: { id: number; typeName: string; amount: number }[];
};
export type RequestData = {
  id: number;
  user: {
    id: number;
    userId: string;
    emailAddresses?: {
      email: string;
      id: number;
    }[];
    first_name: string;
    last_name: string;
    isBanned: boolean;
  };
  details: string;
  agency: { id: number; name: string; userId: string };
  client: {
    id: number;
    clientId: string;
    race: string;
    sex: string;
  };
  pendingApproval: boolean;
  agreementUrl: string | null;
  implementation: string;
  sustainability: string | null;
  approved: boolean;
  denied: boolean;
  pendingPayout: boolean;
  paid: boolean;
  hasPreScreen: boolean;
  preScreenAnswer: {
    id: number;
    housingSituation: number;
    housingQuality: number;
    utilityStress: number;
    foodInsecurityStress: number;
    foodMoneyStress: number;
    transpoConfidence: number;
    transpoStress: number;
    financialDifficulties: number;
    additionalInformation: string;
    createdAt: Date;
  } | null;
  hasPostScreen: boolean;
  postScreenAnswer: {
    id: number;
    housingSituation: number;
    housingQuality: number;
    utilityStress: number;
    foodInsecurityStress: number;
    foodMoneyStress: number;
    transpoConfidence: number;
    transpoStress: number;
    financialDifficulties: number;
    additionalInformation: string;
    createdAt: Date;
  } | null;
  createdAt: Date;
  funds: {
    id: number;
    fundType: {
      id: number;
      typeName: string;
    };
    Receipt?: {
      id: number;
      url: string;
    };
    amount: number;
  }[];
  SDOHs: {
    value: string;
  }[];
  RFFs: {
    value: string;
  }[];
  adminOne: string | null;
  adminTwo: string | null;
  adminThree: string | null;
};

type totalValue = {
  totalValue: number;
};

type AdminEmailPreference = {
  agreementUploaded: boolean;
  caresAssetsAdded: boolean;
  caresBalanceUpdated: boolean;
  created_at: string;
  id: number;
  postCompleted: boolean;
  receiptUploaded: boolean;
  requestReceived: boolean;
  rffAssetsAdded: boolean;
  rffBalanceUpdated: boolean;
  pickupEventScheduled: boolean;
};

export async function isAnyNull(requestId: number) {
  const { userId: clerkuserId } = auth();
  if (!clerkuserId) {
    throw new Error("User not authenticated");
  }
  const isAnyNull = await isAnyNullFromSupabase(requestId);
  return isAnyNull;
}

export async function isAdminOneNull(requestId: number) {
  const { userId: clerkuserId } = auth();
  if (!clerkuserId) {
    throw new Error("User not authenticated");
  }
  const isAdminOneNull = await isAdminOneNullFromSupabase(requestId);
  return isAdminOneNull;
}

export async function isAdminTwoNull(requestId: number) {
  const { userId: clerkuserId } = auth();
  if (!clerkuserId) {
    throw new Error("User not authenticated");
  }
  const isAdminTwoNull = await isAdminTwoNullFromSupabase(requestId);
  return isAdminTwoNull;
}

export async function hasAdminAgreed({
  requestId,
  userId,
}: {
  requestId: number;
  userId: string;
}) {
  const { userId: clerkuserId } = auth();
  if (!clerkuserId) {
    throw new Error("User not authenticated");
  }
  const hasAdminAgreed = await hasAdminAgreedFromSupabase({
    requestId,
    userId,
  });
  return hasAdminAgreed;
}

export async function getNewsCardOne() {
  const { userId: clerkuserId } = auth();
  if (!clerkuserId) {
    throw new Error("User not authenticated");
  }
  const newsCardOne = await getNewsCardOneFromSupabase();
  return newsCardOne;
}

export async function getNewsCardTwo() {
  const { userId: clerkuserId } = auth();
  if (!clerkuserId) {
    throw new Error("User not authenticated");
  }
  const newsCardTwo = await getNewsCardTwoFromSupabase();
  return newsCardTwo;
}

export async function getNewsCardThree() {
  const { userId: clerkuserId } = auth();
  if (!clerkuserId) {
    throw new Error("User not authenticated");
  }
  const newsCardThree = await getNewsCardThreeFromSupabase();
  return newsCardThree;
}

export async function getFundsSumByRequestId(
  requestId: number,
): Promise<number> {
  const { userId: clerkuserId } = auth();
  if (!clerkuserId) {
    throw new Error("User not authenticated");
  }
  const funds = await getFundsByRequestId(requestId);
  let totalValue = 0;
  for (const fund of funds) {
    if (fund.fundTypeId === 3) {
      totalValue += fund.amount * 2.5;
    } else {
      totalValue += fund.amount;
    }
  }
  return totalValue;
}

export async function getTomorrowsEventsAndFunds() {
  const { userId: clerkuserId } = auth();
  if (!clerkuserId) {
    throw new Error("User not authenticated");
  }
  try {
    const events = await getTomorrowsPickupEvents();
    const eventsWithFundsAndUser = await Promise.all(
      events.map(async (event) => {
        const [funds, user] = await Promise.all([
          getFundsByRequestId(event.RequestId),
          getUserByUserId(event.UserId),
        ]);
        return { ...event, funds, user };
      }),
    );
    return eventsWithFundsAndUser;
  } catch (error) {
    console.error("Error fetching events:", error);
    throw error;
  }
}

export async function getTodaysEventsAndFunds() {
  const { userId: clerkuserId } = auth();
  if (!clerkuserId) {
    throw new Error("User not authenticated");
  }
  try {
    const events = await getTodaysPickupEvents();
    const eventsWithFundsAndUser = await Promise.all(
      events.map(async (event) => {
        const [funds, user] = await Promise.all([
          getFundsByRequestId(event.RequestId),
          getUserByUserId(event.UserId),
        ]);
        return { ...event, funds, user };
      }),
    );
    return eventsWithFundsAndUser;
  } catch (error) {
    console.error("Error fetching events:", error);
    throw error;
  }
}

export async function GetAdminEmailPreferenceByUserId(
  userId: string,
): Promise<AdminEmailPreference> {
  const { userId: clerkuserId } = auth();
  if (!clerkuserId) {
    throw new Error("User not authenticated");
  }
  const adminEmailPreference = await getAdminEmailPreferenceByUserId(userId);
  return adminEmailPreference;
}

export async function GetFundsByRequestId(requestId: number) {
  const { userId: clerkuserId } = auth();
  if (!clerkuserId) {
    throw new Error("User not authenticated");
  }
  const funds = await getFundsByRequestId(requestId);
  return funds;
}

export async function GetRFFWalmartCards(): Promise<totalValue[]> {
  const { userId: clerkuserId } = auth();
  if (!clerkuserId) {
    throw new Error("User not authenticated");
  }
  const rffWalmartCards = await getRFFWalmartCards();
  return rffWalmartCards;
}

export async function GetRFFArcoCards(): Promise<totalValue[]> {
  const { userId: clerkuserId } = auth();
  if (!clerkuserId) {
    throw new Error("User not authenticated");
  }
  const rffArcoCards = await getRFFArcoCards();
  return rffArcoCards;
}

export async function requestAllTransactions() {
  const { userId: clerkuserId } = auth();
  if (!clerkuserId) {
    throw new Error("User not authenticated");
  }
  const requests = await getTransactions();
  return requests;
}

export async function readOperatingBalance() {
  const { userId: clerkuserId } = auth();
  if (!clerkuserId) {
    throw new Error("User not authenticated");
  }
  const operatingBalance = await getOperatingBalance();
  return operatingBalance;
}

export async function readRFFBalance() {
  const { userId: clerkuserId } = auth();
  if (!clerkuserId) {
    throw new Error("User not authenticated");
  }
  const rffBalance = await getRFFBalance();
  return rffBalance;
}

export async function giveUserIdGetRequestsNeedingPreScreen(userId: string) {
  const { userId: clerkuserId } = auth();
  if (!clerkuserId) {
    throw new Error("User not authenticated");
  }
  const { data: requests, error } =
    await getRequestsNeedingPreScreenByUserId(userId);
  if (error) throw error;
  return requests;
}

export async function getClientById(clientId: number) {
  const { userId: clerkuserId } = auth();
  if (!clerkuserId) {
    throw new Error("User not authenticated");
  }
  const client = await getClientByClientId(clientId);
  return client;
}

export async function giveUserIdGetRequestsNeedingReceipts(userId: string) {
  const { userId: clerkuserId } = auth();
  if (!clerkuserId) {
    throw new Error("User not authenticated");
  }
  const requests = await getRequestsNeedingReceiptsByUserId(userId);
  return requests;
}

export async function giveUserIdGetRequestsNeedingAgreements(userId: string) {
  const { userId: clerkuserId } = auth();
  if (!clerkuserId) {
    throw new Error("User not authenticated");
  }
  const requests = await getRequestsThatNeedAgreementsByUserId(userId);
  return requests;
}

export async function giveUserIdGetRequestsNeedingPostScreen(userId: string) {
  const { userId: clerkuserId } = auth();
  if (!clerkuserId) {
    throw new Error("User not authenticated");
  }
  const requests = await getRequestsNeedingPostScreenByUserId(userId);
  return requests;
}

export async function requestUsersRequests(userId: string): Promise<
  (Tables<"Request"> & {
    Agency: { name: string } | null;
    Client: { clientID: string; sex: string; race: string } | null;
  })[]
> {
  const { userId: clerkuserId } = auth();
  if (!clerkuserId) {
    throw new Error("User not authenticated");
  }
  try {
    const response = await getRequestsByUserId(userId);
    console.log(response);
    const requests = response.data;
    if (!requests) {
      throw new Error("Failed to fetch requests for user.");
    }
    return requests;
  } catch (error) {
    console.error(`Failed to fetch requests for user ${userId}:`, error);
    throw error;
  }
}

export async function requestUsersClients(
  userId: string,
): Promise<Tables<"Client">[]> {
  const { userId: clerkuserId } = auth();
  if (!clerkuserId) {
    throw new Error("User not authenticated");
  }
  try {
    const allUserClients = await getClientsByUserId(userId);
    return allUserClients;
  } catch (error) {
    console.error(
      "Failed to get call getClientsByUserId from prismaFunctions:",
      error,
    );
    throw error;
  }
}

export async function requestAllFundTypes(): Promise<Tables<"FundType">[]> {
  const { userId: clerkuserId } = auth();
  if (!clerkuserId) {
    throw new Error("User not authenticated");
  }
  try {
    const response = await getFundTypes();

    return response;
  } catch (error) {
    console.error("Failed to call get Fund Types from prismaFunctions:", error);
    throw error;
  }
}

export async function fetchAllRequests() {
  const { userId: clerkuserId } = auth();
  if (!clerkuserId) {
    throw new Error("User not authenticated");
  }
  try {
    const requests = await getAllRequests();
    return requests.filter((request) => request.hasPreScreen);
  } catch (error) {
    console.error(`Failed to fetch requests:`, error);
    return [];
  }
}

export async function fetchAllFundTypes() {
  const { userId: clerkuserId } = auth();
  if (!clerkuserId) {
    throw new Error("User not authenticated");
  }
  try {
    const fundTypes = await getAllFundTypes();
    return fundTypes;
  } catch (error) {
    console.error(`Failed to fetch fund types:`, error);
    return [];
  }
}

export async function fetchAllFunds() {
  const { userId: clerkuserId } = auth();
  if (!clerkuserId) {
    throw new Error("User not authenticated");
  }
  try {
    const funds = await getAllFunds();
    return funds;
  } catch (error) {
    console.error(`Failed to fetch funds:`, error);
    return [];
  }
}

// export async function requestAllRequests(): Promise<Requests[]> {
//   const { userId: clerkuserId } = auth();
//   if (!clerkuserId) {
//     throw new Error("User not authenticated");
//   }
//   console.log("requestAllRequests server action running");
//   try {
//     const response = await getAllRequests();
//     const requests = response;
//     if (!requests) {
//       return [];
//     }

//     const fundTypes = await requestAllFundTypes();
//     const fundTypesMap = new Map(fundTypes.map((ft) => [ft.id, ft.typeName]));

//     const requestsWithFunds = await Promise.all(
//       requests.map(async (request) => {
//         const funds = await getFundsByRequestId(request.id);
//         const formattedFunds = funds.map((fund) => ({
//           id: fund.id,
//           typeName: fundTypesMap.get(fund.fundTypeId) || "Unknown",
//           amount: fund.fundTypeId === 3 ? fund.amount * 2.5 : fund.amount,
//         }));
//         return { ...request, funds: formattedFunds };
//       }),
//     );

//     return requestsWithFunds as unknown as Requests[];
//   } catch (error) {
//     console.error(`Failed to fetch requests:`, error);
//     return [];
//   }
// }

export async function getPaidFunds(): Promise<
  (Tables<"Fund"> & { FundType: Tables<"FundType"> })[]
> {
  const { userId: clerkuserId } = auth();
  if (!clerkuserId) {
    throw new Error("User not authenticated");
  }
  try {
    const response = await getFunds(); // Assuming this calls the getFunds function from @read.ts
    if (!response.data) {
      throw new Error("Failed to fetch paid funds.");
    }
    // Directly return the response data if it matches the expected structure
    return response.data as unknown as (Tables<"Fund"> & {
      FundType: Tables<"FundType">;
    })[];
  } catch (error) {
    console.error("Failed to get paid funds:", error);
    throw error;
  }
}

export async function requestRequestByRequestId(requestId: number): Promise<
  Tables<"Request"> & {
    User: Tables<"User"> & {
      EmailAddress: Tables<"EmailAddress">;
    };
    Client: Tables<"Client">;
    Agency: Tables<"Agency">;
    Fund: Tables<"Fund"> &
      {
        id: number;
        amount: number;
        FundType: Tables<"FundType">;
        Receipt: Tables<"Receipt">;
        needsReceipt: boolean;
      }[];
    preScreenAnswer: Tables<"PreScreenAnswers">;
    postScreenAnswer: Tables<"PostScreenAnswers">;
    Receipt: Tables<"Receipt">;
  }
> {
  const { userId: clerkuserId } = auth();
  if (!clerkuserId) {
    throw new Error("User not authenticated");
  }
  console.log(requestId);
  if (!requestId) {
    throw new Error("Request ID is required.");
  }
  try {
    const request = await getRequestById(requestId);
    if (!request) {
      console.error(`Request with ID ${requestId} not found.`);
      throw new Error(`Request with ID ${requestId} not found.`);
    }
    return request as unknown as Tables<"Request"> & {
      User: Tables<"User"> & {
        EmailAddress: Tables<"EmailAddress">;
      };
      Client: Tables<"Client">;
      Agency: Tables<"Agency">;
      Fund: Tables<"Fund"> &
        {
          id: number;
          amount: number;
          FundType: Tables<"FundType">;
          Receipt: Tables<"Receipt">;
          needsReceipt: boolean;
        }[];
      preScreenAnswer: Tables<"PreScreenAnswers">;
      postScreenAnswer: Tables<"PostScreenAnswers">;
      Receipt: Tables<"Receipt">;
    };
  } catch (error) {
    console.error("Failed to retrieve request by ID:", error);
    throw new Error();
  }
}

export async function requestAllAgencies(): Promise<Tables<"Agency">[]> {
  const { userId: clerkuserId } = auth();
  if (!clerkuserId) {
    throw new Error("User not authenticated");
  }
  const agencies = await getAllAgencies();
  return agencies;
}

export async function AgencyById(agencyId: number) {
  const { userId: clerkuserId } = auth();
  if (!clerkuserId) {
    throw new Error("User not authenticated");
  }
  const agencyName = await getAgencyNameById(agencyId);
  return agencyName;
}

export async function GetAllUsers() {
  const { userId: clerkuserId } = auth();
  if (!clerkuserId) {
    throw new Error("User not authenticated");
  }
  try {
    const response = await getUsers();
    const users = response.data;
    if (!users) {
      throw new Error("Failed to fetch users.");
    }
    return users;
  } catch (error) {
    console.error(`Failed to fetch users:`, error);
    throw error;
  }
}
