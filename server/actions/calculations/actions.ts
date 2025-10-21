"use server";
import {
  getAllPreScreenAnswers,
  getAllPostScreenAnswers,
  getPercentageOfRequestsByAgency,
  getPercentageOfRequestsByFundType,
  dollarsSpentByFundType,
  getTotalRFFDollarsSpent,
  getPercentageOfRequestsByStatus,
  getSDOHPercentages,
  getRequestsByClientRace,
} from "@/server/supabase/functions/read";
import { auth } from "@clerk/nextjs/server";
import {
  countTotalRequests,
  countRequestsByAgency,
  countPaidFundsByRace,
  countPrePostScreenChanges,
  analyzeIncreasedScores,
} from "@/server/supabase/functions/count";
import type {
  PercentRequestStatusReturn,
  SDOHPercentages,
} from "@/server/supabase/functions/read";
import { createClient } from "@/server/supabase/client";

export type AnswerCategories = {
  housingSituation: number;
  housingQuality: number;
  utilityStress: number;
  foodInsecurityStress: number;
  foodMoneyStress: number;
  transpoConfidence: number;
  transpoStress: number;
  financialDifficulties: number;
};

interface AgencyData {
  agencyId: number;
  percentage: number;
}

interface AgencyDatas {
  agencyId: number;
  percentage: number;
}

interface FundTypeData {
  fundTypeId: number;
  percentage: number;
}

interface DollarsSpendData {
  fundTypeId: number;
  dollars: number;
}

export async function GetPrePostPostChangeClientCount(): Promise<number> {
  const { userId } = auth();
  if (!userId) {
    throw new Error("User not authenticated");
  }

  try {
    // Get all pre and post screen answers
    const preScreenAnswers = await getAllPreScreenAnswers();
    const postScreenAnswers = await getAllPostScreenAnswers();

    // Create maps to store total scores by request
    const preScoresByRequest = new Map<number, number>();
    const postScoresByRequest = new Map<number, number>();

    // Calculate total scores for pre-screens
    preScreenAnswers.forEach((answer) => {
      const totalScore =
        answer.housingSituation +
        answer.housingQuality +
        answer.utilityStress +
        answer.foodInsecurityStress +
        answer.foodMoneyStress +
        answer.transpoConfidence +
        answer.transpoStress +
        answer.financialDifficulties;
      preScoresByRequest.set(answer.requestId, totalScore);
    });

    // Calculate total scores for post-screens
    postScreenAnswers.forEach((answer) => {
      const totalScore =
        answer.housingSituation +
        answer.housingQuality +
        answer.utilityStress +
        answer.foodInsecurityStress +
        answer.foodMoneyStress +
        answer.transpoConfidence +
        answer.transpoStress +
        answer.financialDifficulties;
      postScoresByRequest.set(answer.requestId, totalScore);
    });

    // Get all requests to map to clients
    const supabase = createClient();
    const { data: requests } = await supabase
      .from("Request")
      .select("id, clientId")
      .in("id", [...preScoresByRequest.keys()]);

    if (!requests) return 0;

    // Map to store average score change by client
    const clientScoreChanges = new Map<number, number[]>();

    // Calculate score changes for each request and group by client
    requests.forEach((request) => {
      const preScore = preScoresByRequest.get(request.id) || 0;
      const postScore = postScoresByRequest.get(request.id) || 0;
      const change = postScore - preScore;

      if (!clientScoreChanges.has(request.clientId)) {
        clientScoreChanges.set(request.clientId, []);
      }
      clientScoreChanges.get(request.clientId)?.push(change);
    });

    // Count clients with average negative change (improvement)
    let improvedClientCount = 0;
    clientScoreChanges.forEach((changes) => {
      const avgChange = changes.reduce((a, b) => a + b, 0) / changes.length;
      if (avgChange < 0) improvedClientCount++;
    });

    return improvedClientCount;
  } catch (error) {
    console.error("Error in GetPrePostPosChangeClientCount:", error);
    throw error;
  }
}

export async function GetIncreasedScoresAnalysis(): Promise<{
  byAgency: { [key: string]: number };
  byUser: { [key: string]: number };
  byCategory: { [key: string]: number };
  byFundType: { [key: string]: number };
  averageTimeBetweenScreens: number;
}> {
  const { userId } = auth();
  if (!userId) {
    throw new Error("User not authenticated");
  }

  try {
    const analysis = await analyzeIncreasedScores();
    return analysis;
  } catch (error) {
    console.error("Error in GetIncreasedScoresAnalysis:", error);
    throw error;
  }
}

export async function GetPrePostScreenChanges(): Promise<{
  decreased: number;
  increased: number;
}> {
  const { userId } = auth();
  if (!userId) {
    throw new Error("User not authenticated");
  }

  try {
    const changes = await countPrePostScreenChanges();
    return changes;
  } catch (error) {
    console.error(
      "Error in actions/calculations/actions.ts GetPrePostScreenChanges:",
      error,
    );
    throw error;
  }
}

export async function GetPaidFundPercentagesByRace(): Promise<{
  [key: string]: { percentage: number; count: number };
}> {
  const { userId } = auth();
  if (!userId) {
    throw new Error("User not authenticated");
  }

  try {
    const raceCounts = await countPaidFundsByRace();
    const totalCount = Object.values(raceCounts).reduce(
      (sum, { count }) => sum + count,
      0,
    );

    const percentages: {
      [key: string]: { percentage: number; count: number };
    } = {};

    for (const [race, { count }] of Object.entries(raceCounts)) {
      percentages[race] = {
        percentage: totalCount > 0 ? (count / totalCount) * 100 : 0,
        count: count,
      };
    }

    return percentages;
  } catch (error) {
    console.error("Error in GetPaidFundPercentagesByRace:", error);
    throw error;
  }
}

export async function GetSDOHPercentages(): Promise<SDOHPercentages> {
  const { userId } = auth();
  if (!userId) {
    throw new Error("User not authenticated");
  }
  const percentages = await getSDOHPercentages();
  return percentages;
}

export async function GetPercentageOfRequestsByStatus(): Promise<PercentRequestStatusReturn> {
  const { userId } = auth();
  if (!userId) {
    throw new Error("User not authenticated");
  }
  const percentages = await getPercentageOfRequestsByStatus();
  return percentages;
}

export async function GetTotalRFFDollarsSpent() {
  const { userId } = auth();
  if (!userId) {
    throw new Error("User not authenticated");
  }
  const totalDollars = await getTotalRFFDollarsSpent();
  return totalDollars;
}

export async function GetDollarsSpentByFundType(): Promise<DollarsSpendData[]> {
  const { userId } = auth();
  if (!userId) {
    throw new Error("User not authenticated");
  }
  const dollars = await dollarsSpentByFundType();
  return dollars;
}

export async function GetPercentageOfRequestsByFundType(): Promise<
  FundTypeData[]
> {
  const { userId } = auth();
  if (!userId) {
    throw new Error("User not authenticated");
  }
  const percentages = await getPercentageOfRequestsByFundType();
  return percentages;
}

export async function GetPercentageOfRequestsByAgency(): Promise<AgencyData[]> {
  const { userId: clerkuserId } = auth();
  if (!clerkuserId) {
    throw new Error("User not authenticated");
  }
  const percentages = await getPercentageOfRequestsByAgency();
  return percentages;
}

export async function getAgencyRequestPercentages(): Promise<AgencyDatas[]> {
  const { userId } = auth();
  if (!userId) {
    throw new Error("User not authenticated");
  }
  const agencyIds = [1, 3, 4, 5, 6, 7, 8];
  const agencyCounts = await Promise.all(
    agencyIds.map(async (agencyId) => {
      try {
        const count = await countRequestsByAgency(agencyId);
        return { agencyId, count };
      } catch (error) {
        console.error(error);
        throw error;
      }
    }),
  );
  const totalRequests = agencyCounts.reduce((acc, { count }) => acc + count, 0);
  const percentages = agencyCounts.map(({ agencyId, count }) => {
    const percentage = totalRequests > 0 ? (count / totalRequests) * 100 : 0;
    return { agencyId, percentage };
  });
  return percentages;
}

export async function getPreScreenAverages(
  startDate?: string | null,
  endDate?: string | null,
) {
  const { userId } = auth();
  if (!userId) {
    throw new Error("User not authenticated");
  }
  const preScreenAnswers = await getAllPreScreenAnswers(startDate, endDate);
  const categories: AnswerCategories = {
    housingSituation: 0,
    housingQuality: 0,
    utilityStress: 0,
    foodInsecurityStress: 0,
    foodMoneyStress: 0,
    transpoConfidence: 0,
    transpoStress: 0,
    financialDifficulties: 0,
  };
  const categoryCounts: AnswerCategories = {
    ...categories,
  };
  preScreenAnswers.forEach((answer) => {
    categories.housingSituation += answer.housingSituation;
    categories.housingQuality += answer.housingQuality;
    categories.utilityStress += answer.utilityStress;
    categories.foodInsecurityStress += answer.foodInsecurityStress;
    categories.foodMoneyStress += answer.foodMoneyStress;
    categories.transpoConfidence += answer.transpoConfidence;
    categories.transpoStress += answer.transpoStress;
    categories.financialDifficulties += answer.financialDifficulties;
    Object.keys(categoryCounts).forEach((key) => {
      categoryCounts[key as keyof AnswerCategories]++;
    });
  });
  const averages = Object.keys(categories).reduce((acc, key) => {
    acc[key as keyof AnswerCategories] = parseFloat(
      (
        categories[key as keyof AnswerCategories] /
        categoryCounts[key as keyof AnswerCategories]
      ).toFixed(2),
    );
    return acc;
  }, {} as AnswerCategories);
  return averages;
}

export async function getPostScreenAverages(
  startDate?: string | null,
  endDate?: string | null,
) {
  const { userId } = auth();
  if (!userId) {
    throw new Error("User not authenticated");
  }
  const postScreenAnswers = await getAllPostScreenAnswers(startDate, endDate);
  const categories: AnswerCategories = {
    housingSituation: 0,
    housingQuality: 0,
    utilityStress: 0,
    foodInsecurityStress: 0,
    foodMoneyStress: 0,
    transpoConfidence: 0,
    transpoStress: 0,
    financialDifficulties: 0,
  };
  const categoryCounts: AnswerCategories = {
    ...categories,
  };
  postScreenAnswers.forEach((answer) => {
    categories.housingSituation += answer.housingSituation;
    categories.housingQuality += answer.housingQuality;
    categories.utilityStress += answer.utilityStress;
    categories.foodInsecurityStress += answer.foodInsecurityStress;
    categories.foodMoneyStress += answer.foodMoneyStress;
    categories.transpoConfidence += answer.transpoConfidence;
    categories.transpoStress += answer.transpoStress;
    categories.financialDifficulties += answer.financialDifficulties;
    Object.keys(categoryCounts).forEach((key) => {
      categoryCounts[key as keyof AnswerCategories]++;
    });
  });
  const averages = Object.keys(categories).reduce((acc, key) => {
    acc[key as keyof AnswerCategories] = parseFloat(
      (
        categories[key as keyof AnswerCategories] /
        categoryCounts[key as keyof AnswerCategories]
      ).toFixed(2),
    );
    return acc;
  }, {} as AnswerCategories);
  return averages;
}

/**
 * Server action to get requests breakdown by client race
 * Includes authentication check and optional date filtering
 */
export async function GetRequestsByClientRace(
  startDate?: string | null,
  endDate?: string | null,
) {
  const { userId } = auth();
  if (!userId) {
    throw new Error("User not authenticated");
  }

  return await getRequestsByClientRace(startDate, endDate);
}
