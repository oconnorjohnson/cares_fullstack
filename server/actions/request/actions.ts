"use server";

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
  getRFFWalmartCards,
  getRFFArcoCards,
  getAdminEmailPreferenceByUserId,
  getAdminEmailPreferenceById,
  getTomorrowsPickupEvents,
  getTodaysPickupEvents,
  getUserByUserId,
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
};

export async function getTomorrowsEventsAndFunds() {
  try {
    const events = await getTomorrowsPickupEvents();
    const eventsWithFundsAndUser = await Promise.all(
      events.map(async (event) => {
        // Fetch both funds and user in parallel for each event
        const [funds, user] = await Promise.all([
          getFundsByRequestId(event.RequestId),
          getUserByUserId(event.UserId),
        ]);
        // Combine event data with funds and user
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
  const adminEmailPreference = await getAdminEmailPreferenceByUserId(userId);
  return adminEmailPreference;
}

export async function GetFundsByRequestId(requestId: number) {
  const funds = await getFundsByRequestId(requestId);
  return funds;
}

export async function GetRFFWalmartCards(): Promise<totalValue[]> {
  const rffWalmartCards = await getRFFWalmartCards();
  return rffWalmartCards;
}

export async function GetRFFArcoCards(): Promise<totalValue[]> {
  const rffArcoCards = await getRFFArcoCards();
  return rffArcoCards;
}

export async function requestAllTransactions() {
  const requests = await getTransactions();
  return requests;
}

export async function readOperatingBalance() {
  const operatingBalance = await getOperatingBalance();
  return operatingBalance;
}

export async function readRFFBalance() {
  const rffBalance = await getRFFBalance();
  return rffBalance;
}

export async function giveUserIdGetRequestsNeedingPreScreen(userId: string) {
  const requests = await getRequestsNeedingPreScreenByUserId(userId);
  return requests;
}

export async function getClientById(clientId: number) {
  const client = await getClientByClientId(clientId);
  return client;
}

export async function giveUserIdGetRequestsNeedingReceipts(userId: string) {
  const requests = await getRequestsNeedingReceiptsByUserId(userId);
  return requests;
}

export async function giveUserIdGetRequestsNeedingAgreements(userId: string) {
  const requests = await getRequestsThatNeedAgreementsByUserId(userId);
  return requests;
}

export async function giveUserIdGetRequestsNeedingPostScreen(userId: string) {
  const requests = await getRequestsNeedingPostScreenByUserId(userId);
  return requests;
}

export async function requestUsersRequests(userId: string): Promise<
  (Tables<"Request"> & {
    Agency: { name: string } | null;
    Client: { clientID: string; sex: string; race: string } | null;
  })[]
> {
  try {
    const response = await getRequestsByUserId(userId);
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
  try {
    const response = await getFundTypes();

    return response;
  } catch (error) {
    console.error("Failed to call get Fund Types from prismaFunctions:", error);
    throw error;
  }
}

export async function requestAllRequests(): Promise<Request[]> {
  console.log("requestAllRequests server action running");
  try {
    const response = await getAllRequests();
    const requests = response;
    if (!requests) {
      // Ensure an empty array is returned if there are no requests
      return [];
    }
    return requests as unknown as Request[];
  } catch (error) {
    console.error(`Failed to fetch requests:`, error);
    // Return an empty array in case of an error to prevent .map() from failing
    return [];
  }
}

export async function getPaidFunds(): Promise<
  (Tables<"Fund"> & { FundType: Tables<"FundType"> })[]
> {
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
  const agencies = await getAllAgencies();
  return agencies;
}

export async function AgencyById(agencyId: number) {
  const agencyName = await getAgencyNameById(agencyId);
  return agencyName;
}

export async function GetAllUsers() {
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
