import { createClient as createSupabaseClient } from "@/server/supabase/server";

export async function countPrePostScreenChanges(): Promise<{
  decreased: number;
  increased: number;
}> {
  const supabase = createSupabaseClient();
  try {
    const { data, error } = await supabase
      .from("Request")
      .select(
        `
        id,
        PreScreenAnswers (
          housingSituation, housingQuality, utilityStress, foodInsecurityStress,
          foodMoneyStress, transpoConfidence, transpoStress, financialDifficulties
        ),
        PostScreenAnswers (
          housingSituation, housingQuality, utilityStress, foodInsecurityStress,
          foodMoneyStress, transpoConfidence, transpoStress, financialDifficulties
        )
      `,
      )
      .eq("paid", true)
      .eq("hasPreScreen", true)
      .eq("hasPostScreen", true);

    if (error) throw error;

    let decreased = 0;
    let increased = 0;

    data.forEach((request) => {
      const preScreen = request.PreScreenAnswers[0];
      const postScreen = request.PostScreenAnswers[0];

      if (!preScreen || !postScreen) return;

      const preSum = Object.values(preScreen).reduce(
        (sum, val) => sum + (val as number),
        0,
      );
      const postSum = Object.values(postScreen).reduce(
        (sum, val) => sum + (val as number),
        0,
      );

      if (postSum < preSum) {
        decreased++;
      } else if (postSum > preSum) {
        increased++;
      }
      // If postSum === preSum, we don't count it as either increased or decreased
    });

    return { decreased, increased };
  } catch (error) {
    console.error("Error in countPrePostScreenChanges:", error);
    throw error;
  }
}

export async function countPaidFundsByRace(): Promise<{
  [key: string]: { count: number; totalAmount: number };
}> {
  const supabase = createSupabaseClient();
  try {
    const { data, error } = await supabase
      .from("Fund")
      .select(
        `
        amount,
        Request (
          Client (
            race
          )
        )
      `,
      )
      .eq("paid", true);

    if (error) throw error;

    const raceCounts: {
      [key: string]: { count: number; totalAmount: number };
    } = {
      White: { count: 0, totalAmount: 0 },
      Asian: { count: 0, totalAmount: 0 },
      "African American / Black": { count: 0, totalAmount: 0 },
      "Hispanic / Latino": { count: 0, totalAmount: 0 },
      "Middle Eastern / North African": { count: 0, totalAmount: 0 },
      "American Indian / Alaska Native": { count: 0, totalAmount: 0 },
      Other: { count: 0, totalAmount: 0 },
      "Native Hawaiian / Other Pacific Islander": { count: 0, totalAmount: 0 },
      Unknown: { count: 0, totalAmount: 0 },
      Unavailable: { count: 0, totalAmount: 0 },
    };

    data.forEach((fund) => {
      const race = fund.Request?.Client?.race || "Unavailable";
      if (!raceCounts[race]) {
        raceCounts[race] = { count: 0, totalAmount: 0 };
      }
      raceCounts[race].count++;
      raceCounts[race].totalAmount += fund.amount;
    });

    return raceCounts;
  } catch (error) {
    console.error(
      "Error in countPaidFundsByRace supabase/functions/count.ts:",
      error,
    );
    throw error;
  }
}

export async function countRFFWalmartCards(): Promise<{
  count: number | null;
  totalSum: number | null;
}> {
  const supabase = createSupabaseClient();
  try {
    const { data, error, count } = await supabase
      .from("Asset")
      .select("totalValue", { count: "exact" })
      .eq("isRFF", true)
      .eq("isCARES", false)
      .eq("isAvailable", true)
      .eq("FundTypeId", 1);

    if (error) throw error;

    const totalSum = data.reduce(
      (acc, { totalValue }) => acc + Number(totalValue),
      0,
    );

    return { count, totalSum };
  } catch (error) {
    console.error("Error in countRFFWalmartCards:", error);
    throw error;
  }
}

export async function countRFFArcoCards(): Promise<{
  count: number | null;
  totalSum: number | null;
}> {
  const supabase = createSupabaseClient();
  try {
    const { data, count, error } = await supabase
      .from("Asset")
      .select("*", { count: "exact" })
      .eq("isRFF", true)
      .eq("isCARES", false)
      .eq("isAvailable", true)
      .eq("FundTypeId", 2);
    if (error) throw error;
    const totalSum = data.reduce(
      (acc, { totalValue }) => acc + Number(totalValue),
      0,
    );

    return { count, totalSum };
  } catch (error) {
    throw error;
  }
}

export async function countCARESWalmartCards(): Promise<{
  count: number | null;
  totalSum: number | null;
}> {
  const supabase = createSupabaseClient();
  try {
    const { data, count, error } = await supabase
      .from("Asset")
      .select("*", { count: "exact" })
      .eq("isRFF", false)
      .eq("isCARES", true)
      .eq("FundTypeId", 1);
    if (error) throw error;
    const totalSum = data.reduce(
      (acc, { totalValue }) => acc + Number(totalValue),
      0,
    );

    return { count, totalSum };
  } catch (error) {
    throw error;
  }
}

export async function countCARESArcoCards(): Promise<{
  count: number | null;
  totalSum: number | null;
}> {
  const supabase = createSupabaseClient();
  try {
    const { data, count, error } = await supabase
      .from("Asset")
      .select("*", { count: "exact" })
      .eq("isRFF", false)
      .eq("isCARES", true)
      .eq("FundTypeId", 2);
    if (error) throw error;
    const totalSum = data.reduce(
      (acc, { totalValue }) => acc + Number(totalValue),
      0,
    );

    return { count, totalSum };
  } catch (error) {
    throw error;
  }
}

export async function countAvailableRFFBusPasses(): Promise<number | null> {
  const supabase = createSupabaseClient();
  try {
    const { count, error } = await supabase
      .from("Asset")
      .select("*", { count: "exact" })
      .eq("FundTypeId", 3)
      .eq("isAvailable", true)
      .eq("isRFF", true)
      .eq("isCARES", false);
    if (error) {
      console.error("Error in countAvailableRFFBusPasses:", error);
      throw error;
    }
    return count;
  } catch (error) {
    console.error("Unexpected error in countAvailableRFFBusPasses:", error);
    throw error;
  }
}

export async function countReservedRFFBusPasses(): Promise<number | null> {
  const supabase = createSupabaseClient();
  try {
    const { count, error } = await supabase
      .from("Asset")
      .select("*", { count: "exact" })
      .eq("FundTypeId", 3)
      .eq("isAvailable", false)
      .eq("isReserved", true)
      .eq("isRFF", true)
      .eq("isCARES", false);
    if (error) {
      console.error("Error in countReservedRFFBusPasses:", error);
      throw error;
    }
    return count;
  } catch (error) {
    console.error("Unexpected error in countReservedRFFBusPasses:", error);
    throw error;
  }
}

export async function countAvailableCARESBusPasses(): Promise<number | null> {
  const supabase = createSupabaseClient();
  try {
    const { count, error } = await supabase
      .from("Asset")
      .select("*", { count: "exact" })
      .eq("FundTypeId", 3)
      .eq("isAvailable", true)
      .eq("isRFF", false)
      .eq("isCARES", true);
    if (error) {
      console.error("Error in countAvailableCARESBusPasses:", error);
      throw error;
    }
    return count;
  } catch (error) {
    console.error("Unexpected error in countAvailableCARESBusPasses:", error);
    throw error;
  }
}

export async function countReservedCARESBusPasses(): Promise<number | null> {
  const supabase = createSupabaseClient();
  try {
    const { count, error } = await supabase
      .from("Asset")
      .select("*", { count: "exact" })
      .eq("FundTypeId", 3)
      .eq("isAvailable", false)
      .eq("isReserved", true)
      .eq("isRFF", false)
      .eq("isCARES", true);
    if (error) {
      console.error("Error in countReservedCARESBusPasses:", error);
      throw error;
    }
    return count;
  } catch (error) {
    console.error("Unexpected error in countReservedCARESBusPasses:", error);
    throw error;
  }
}

export async function countPendingRequests() {
  const supabase = createSupabaseClient();
  try {
    const { count, error } = await supabase
      .from("Request")
      .select("*", { count: "exact" })
      .eq("pendingApproval", true);
    if (error) throw error;
    console.log(error);
    console.log(count);
    return count;
  } catch (error) {
    throw error;
  }
}

export async function countCompletedRequests() {
  const supabase = createSupabaseClient();
  try {
    const { count, error } = await supabase
      .from("Request")
      .select("*", { count: "exact" })
      .eq("approved", true)
      .eq("paid", true);
    if (error) throw error;
    console.log(error);
    console.log(count);
    return count;
  } catch (error) {
    throw error;
  }
}

export async function countClientsByUserId(userId: string) {
  const supabase = createSupabaseClient();
  try {
    const { count, error } = await supabase
      .from("Client")
      .select("*", { count: "exact" })
      .eq("userId", userId);
    if (error) throw error;
    console.log(error);
    console.log(count);
    return count;
  } catch (error) {
    throw error;
  }
}

export async function countDeniedRequests() {
  const supabase = createSupabaseClient();
  try {
    const { count, error } = await supabase
      .from("Request")
      .select("*", { count: "exact" })
      .eq("denied", true);
    if (error) throw error;
    console.log(error);
    console.log(count);
    return count;
  } catch (error) {
    throw error;
  }
}

export async function countTotalRequests() {
  const supabase = createSupabaseClient();
  try {
    const { count, error } = await supabase
      .from("Request")
      .select("*", { count: "exact" });
    if (error) {
      console.log(error);
      throw error;
    }
    return count;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function countRequestsByAgency(agencyId: number): Promise<number> {
  const supabase = createSupabaseClient();
  try {
    const { data, error, count } = await supabase
      .from("Request")
      .select("*", { count: "exact" })
      .eq("agencyId", agencyId);

    if (error) throw error;

    // Directly return the count as a number. If count is null, return 0.
    return count ?? 0;
  } catch (error) {
    console.error(
      `Error in countRequestsByAgency for agencyId ${agencyId}:`,
      error,
    );
    throw error;
  }
}

export async function countOpenRequestsByUserId(userId: string) {
  const supabase = createSupabaseClient();
  try {
    const { count, error } = await supabase
      .from("Request")
      .select("*", { count: "exact" })
      .eq("userId", userId)
      .eq("pendingApproval", true)
      .eq("approved", false)
      .eq("denied", false);
    return count;
  } catch (error) {
    throw error;
  }
}

export async function countApprovedRequestsByUserId(userId: string) {
  const supabase = createSupabaseClient();
  try {
    const { count, error } = await supabase
      .from("Request")
      .select("*", { count: "exact" })
      .eq("userId", userId)
      .eq("approved", true)
      .eq("pendingApproval", false)
      .eq("denied", false);
    return count;
  } catch (error) {
    throw error;
  }
}

export async function countDeniedRequestsByUserId(userId: string) {
  const supabase = createSupabaseClient();
  try {
    const { count, error } = await supabase
      .from("Request")
      .select("*", { count: "exact" })
      .eq("userId", userId)
      .eq("denied", true);
    return count;
  } catch (error) {
    throw error;
  }
}
