import { createClient } from "@/server/supabase/server";
import { TablesInsert } from "@/types_db";

interface PreScreenData {
  housingSituation: number;
  housingQuality: number;
  utilityStress: number;
  foodInsecurityStress: number;
  foodMoneyStress: number;
  transpoConfidence: number;
  transpoStress: number;
  financialDifficulties: number;
  additionalInformation: string;
}

interface PostScreenData {
  housingSituation: number;
  housingQuality: number;
  utilityStress: number;
  foodInsecurityStress: number;
  foodMoneyStress: number;
  transpoConfidence: number;
  transpoStress: number;
  financialDifficulties: number;
  additionalInformation: string;
}

export async function createAgencyTyped(agencyData: TablesInsert<"Agency">) {
  const supabase = createClient();

  const { data, error } = await supabase.from("Agency").insert([agencyData]);

  if (error) throw error;
  return data;
}
