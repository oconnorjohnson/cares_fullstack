import { createClient } from "@/server/supabase/client";
import { Database } from "@/types_db";
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

const supabase = createClient();

export async function createFundType(fundTypeData: {
  userId: string;
  typeName: string;
}) {
  if (!fundTypeData.userId || !fundTypeData.typeName) {
    throw new Error("UserId and Fund Type Name are required.");
  }
  try {
    const newFundTypeRecord = await supabase.from("FundType").insert({
      typeName: fundTypeData.typeName,
      user_id: fundTypeData.userId,
    });
    console.log("New fund type created successfully:", newFundTypeRecord);
    return newFundTypeRecord;
  } catch (error) {
    console.error("Error creating new fund type:", error);
    throw error;
  }
}

export async function createNewReceiptRecord(newReceiptRecord: {
  userId: string;
  url: string;
  requestId: number;
  fundId: number;
}) {
  if (
    !newReceiptRecord.userId ||
    !newReceiptRecord.url ||
    !newReceiptRecord.requestId ||
    !newReceiptRecord.fundId
  ) {
    throw new Error("UserId, URL, Request ID, and Fund ID are required.");
  }
  console.log("Creating new receipt record with data:", newReceiptRecord);
  try {
    const newReceipt = await supabase.from("Receipt").insert({
      userId: newReceiptRecord.userId,
      url: newReceiptRecord.url,
      requestId: newReceiptRecord.requestId,
      fundId: newReceiptRecord.fundId,
    });
    console.log("New receipt record created successfully:", newReceipt);
    await supabase
      .from("Request")
      .update({
        needsReceipts: false,
      })
      .eq("id", newReceiptRecord.requestId);
    return newReceipt;
  } catch (error) {
    console.error("Error creating new receipt record:", error);
    throw error;
  }
}

export async function createNewFundByRequestId(newFundData: {
  requestId: number;
  fundTypeId: number;
  amount: number;
}) {
  if (
    !newFundData.requestId ||
    !newFundData.fundTypeId ||
    !newFundData.amount
  ) {
    throw new Error("Request ID, Fund Type ID, and Amount are required.");
  }
  console.log("Creating new fund with data:", newFundData);
  try {
    const newFund = await supabase.from("Fund").insert({
      requestId: newFundData.requestId,
      fundTypeId: newFundData.fundTypeId,
      amount: newFundData.amount,
    });
    console.log("New fund created successfully:", newFund);
    return newFund;
  } catch (error) {
    console.error("Error creating new fund:", error);
    throw error;
  }
}

export async function createPreScreen(
  preScreenData: PreScreenData,
  requestId: number,
) {
  const preScreen = await supabase.from("preScreenAnswers").insert({
    additionalInformation: preScreenData.additionalInformation,
    financialDifficulties: preScreenData.financialDifficulties,
    foodInsecurityStress: preScreenData.foodInsecurityStress,
    foodMoneyStress: preScreenData.foodMoneyStress,
    housingQuality: preScreenData.housingQuality,
    housingSituation: preScreenData.housingSituation,
    id: requestId,
    requestId: requestId,
    transpoConfidence: preScreenData.transpoConfidence,
    transpoStress: preScreenData.transpoStress,
    utilityStress: preScreenData.utilityStress,
  });
  if (preScreen) {
    await supabase
      .from("Request")
      .update({
        hasPreScreen: true,
      })
      .eq("id", requestId);
  }
  return preScreen;
}

export async function createPostScreen(
  postScreenData: PostScreenData,
  requestId: number,
) {
  const postScreen = await supabase.from("postScreenAnswers").insert({
    additionalInformation: postScreenData.additionalInformation,
    financialDifficulties: postScreenData.financialDifficulties,
    foodInsecurityStress: postScreenData.foodInsecurityStress,
    foodMoneyStress: postScreenData.foodMoneyStress,
    housingQuality: postScreenData.housingQuality,
    housingSituation: postScreenData.housingSituation,
    id: requestId,
    requestId: requestId,
    transpoConfidence: postScreenData.transpoConfidence,
    transpoStress: postScreenData.transpoStress,
    utilityStress: postScreenData.utilityStress,
  });
  if (postScreen) {
    await supabase
      .from("Request")
      .update({
        hasPostScreen: true,
      })
      .eq("id", requestId);
  }
  return postScreen;
}

export async function createAgency(agencyData: {
  userId: string;
  name: string;
}) {
  const newAgency = await supabase.from("Agency").insert({
    userId: agencyData.userId,
    name: agencyData.name,
  });
  return newAgency;
}

export async function createRequest(requestData: {
  clientId: number;
  userId: string;
  agencyId: number;
  details: string;
  implementation: string;
  sustainability: string;
  funds: { fundTypeId: number; amount: number }[];
  SDOH: string[];
  RFF: string[];
}) {
  try {
    // Create the Request record
    const request = await supabase.from("Request").insert({
      agencyId: requestData.agencyId,
      agreementUrl: null,
      approved: false,
      clientId: requestData.clientId,
      denied: false,
      details: requestData.details,
      hasPostScreen: false,
      hasPreScreen: false,
      id: null,
      implementation: requestData.implementation,
      needsReceipts: false,
      paid: false,
      pendingApproval: true,
      pendingPayout: false,
      postScreenAnswerId: null,
      preScreenAnswerId: null,
      RFFId: null,
      SDOHId: null,
      sustainability: requestData.sustainability,
      userId: requestData.userId,
    });
    return request;
  } catch (error) {
    console.error("Error creating new request and related records:", error);
    throw error;
  }
}
