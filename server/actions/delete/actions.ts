"use server";

import { deleteFundById } from "@/prisma/prismaFunctions";

interface RequestData {
  id: number;
  user: {
    id: number;
    userId: string;
    first_name: string;
    last_name: string;
    isBanned: boolean;
  };
  details: string;
  agency: { id: number; name: string; userId: string };
  client: {
    id: number;
    first_name: string;
    last_name: string;
  };
  pendingApproval: boolean;
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
    amount: number;
  }[];
  SDOHs: {
    value: string;
  }[];
  RFFs: {
    value: string;
  }[];
}
