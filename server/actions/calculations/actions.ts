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

export async function getPreScreenAverages() {
  const { userId } = auth();
  if (!userId) {
    throw new Error("User not authenticated");
  }
  const preScreenAnswers = await getAllPreScreenAnswers();
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

export async function getPostScreenAverages() {
  const { userId } = auth();
  if (!userId) {
    throw new Error("User not authenticated");
  }
  const postScreenAnswers = await getAllPostScreenAnswers();
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
