"use server";
import {
  getAllPreScreenAnswers,
  getAllPostScreenAnswers,
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

export async function getPreScreenAverages() {
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
    acc[key as keyof AnswerCategories] =
      categories[key as keyof AnswerCategories] /
      categoryCounts[key as keyof AnswerCategories];
    return acc;
  }, {} as AnswerCategories);
  return averages;
}

export async function getPostScreenAverages() {
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
    acc[key as keyof AnswerCategories] =
      categories[key as keyof AnswerCategories] /
      categoryCounts[key as keyof AnswerCategories];
    return acc;
  }, {} as AnswerCategories);
  return averages;
}
