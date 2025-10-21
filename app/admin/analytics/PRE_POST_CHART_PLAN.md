# Pre/Post Analysis Chart Date Filtering - Minimal POC

## Scope

Add date range filtering to ONLY the Pre/Post Analysis chart as a proof of concept.

---

## Option A: Server Component (Simpler - Recommended for POC)

### Step 1: Update Supabase Functions (15 min)

**File: `server/supabase/functions/read.ts`**

```typescript
// UPDATE 1: getAllPreScreenAnswers
export async function getAllPreScreenAnswers(
  startDate?: string | null,
  endDate?: string | null,
): Promise<Tables<"PreScreenAnswers">[]> {
  const supabase = createSupabaseClient();
  try {
    let query = supabase.from("PreScreenAnswers").select("*");

    // Apply date filters
    if (startDate) {
      query = query.gte("created_at", startDate);
    }
    if (endDate) {
      const endDateInclusive = new Date(endDate);
      endDateInclusive.setDate(endDateInclusive.getDate() + 1);
      query = query.lt(
        "created_at",
        endDateInclusive.toISOString().split("T")[0],
      );
    }

    const { data, error } = await query;
    if (error) {
      console.error("Error in getAllPreScreenAnswers:", error);
      throw error;
    }
    return data;
  } catch (error) {
    console.error("Unexpected error in getAllPreScreenAnswers:", error);
    throw error;
  }
}

// UPDATE 2: getAllPostScreenAnswers
export async function getAllPostScreenAnswers(
  startDate?: string | null,
  endDate?: string | null,
): Promise<Tables<"PostScreenAnswers">[]> {
  const supabase = createSupabaseClient();
  try {
    let query = supabase.from("PostScreenAnswers").select("*");

    // Apply date filters
    if (startDate) {
      query = query.gte("created_at", startDate);
    }
    if (endDate) {
      const endDateInclusive = new Date(endDate);
      endDateInclusive.setDate(endDateInclusive.getDate() + 1);
      query = query.lt(
        "created_at",
        endDateInclusive.toISOString().split("T")[0],
      );
    }

    const { data, error } = await query;
    if (error) {
      console.error("Error in getAllPostScreenAnswers:", error);
      throw error;
    }
    return data;
  } catch (error) {
    console.error("Unexpected error in getAllPostScreenAnswers:", error);
    throw error;
  }
}
```

---

### Step 2: Update Server Actions (10 min)

**File: `server/actions/calculations/actions.ts`**

```typescript
// UPDATE 1: getPreScreenAverages
export async function getPreScreenAverages(
  startDate?: string | null,
  endDate?: string | null,
) {
  const { userId } = auth();
  if (!userId) {
    throw new Error("User not authenticated");
  }
  const preScreenAnswers = await getAllPreScreenAnswers(startDate, endDate); // Pass dates

  // ... rest of function stays the same
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

// UPDATE 2: getPostScreenAverages
export async function getPostScreenAverages(
  startDate?: string | null,
  endDate?: string | null,
) {
  const { userId } = auth();
  if (!userId) {
    throw new Error("User not authenticated");
  }
  const postScreenAnswers = await getAllPostScreenAnswers(startDate, endDate); // Pass dates

  // ... rest of function stays the same (identical logic to pre)
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
```

---

### Step 3: Update Analytics Page (15 min)

**File: `app/admin/analytics/page.tsx`**

Keep as server component, read search params:

```typescript
import { auth } from "@clerk/nextjs";
import SideNavBar from "@/components/admin/dashboard/side-nav";
import PrePostAnalysis from "@/components/admin/dashboard/pre-post-analysis";
// ... other imports
import { ScrollArea } from "@/components/ui/scroll-area";

// Add this import for search params
type SearchParams = {
  startDate?: string;
  endDate?: string;
};

export default async function Analytics({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { sessionClaims } = auth();
  const isAdmin = (sessionClaims?.publicMetadata as any)?.admin;

  // Extract dates from URL params
  const startDate = searchParams.startDate || null;
  const endDate = searchParams.endDate || null;

  const [
    totalRequests,
    percentagesByAssetTypeAndAgency,
    preAnswers, // Now filtered by date
    postAnswers, // Now filtered by date
    dollarsSpentByFundType,
    agencyPercentagesRaw,
    totalRFFDollarsSpent,
    percentagesByStatus,
    sdohPercentages,
    prePostChanges,
    paidFundsByRace,
    scoreAnalysis,
    prePostPostChangeClientCount,
  ] = await Promise.all([
    CountRequestsCompleted(), // No dates
    GetPercentageOfRequestsByFundType(), // No dates
    getPreScreenAverages(startDate, endDate), // PASS DATES
    getPostScreenAverages(startDate, endDate), // PASS DATES
    GetDollarsSpentByFundType(), // No dates
    GetPercentageOfRequestsByAgency(), // No dates
    GetTotalRFFDollarsSpent(), // No dates
    GetPercentageOfRequestsByStatus(), // No dates
    GetSDOHPercentages(), // No dates
    GetPrePostScreenChanges(), // No dates
    GetPaidFundPercentagesByRace(), // No dates
    GetIncreasedScoresAnalysis(), // No dates
    GetPrePostPostChangeClientCount(), // No dates
  ]);

  // Rest of component stays the same...
  const prePostCategories: (keyof AnswerCategories)[] = [
    "housingSituation",
    "housingQuality",
    "utilityStress",
    "foodInsecurityStress",
    "foodMoneyStress",
    "transpoConfidence",
    "transpoStress",
    "financialDifficulties",
  ];

  const agencyPercentages = convertAgencyData(agencyPercentagesRaw);

  const prePostChartData = prePostCategories.map((category) => ({
    category,
    preValue: getCategoryValue(category, preAnswers),
    postValue: getCategoryValue(category, postAnswers),
  }));

  const fundPopChartData = percentagesByAssetTypeAndAgency.map(
    ({ fundTypeId, percentage }) => ({
      fundTypeId,
      percentage,
      fundTypeName: fundTypeIdToNameMap[fundTypeId],
    }),
  );

  const dollarsSpentChartData = dollarsSpentByFundType.map(
    ({ fundTypeId, dollars }) => ({
      fundTypeId,
      dollars,
      fundTypeName: fundTypeIdToNameMap[fundTypeId],
    }),
  );

  if (!isAdmin) {
    return <div>Not authenticated</div>;
  } else {
    return (
      <>
        <div className="flex flex-row sm:h-screen w-screen">
          <SideNavBar />
          <ScrollArea className="w-full h-full">
            <div className="flex flex-col sm:grid sm:grid-cols-3 border-t w-full gap-4 py-4 px-4">
              {/* Only the PrePostAnalysis chart uses filtered data */}
              <PrePostAnalysis chartData={prePostChartData} />

              {/* These charts show all-time data */}
              <DollarsSpent
                totalSpent={totalRFFDollarsSpent}
                chartData={dollarsSpentChartData}
              />
              <PercentRequestStatus chartData={percentagesByStatus} />
              <SDOHCategoryDistribution chartData={sdohPercentages} />
              <RequestsByAgency
                totalRequests={totalRequests!}
                chartData={agencyPercentages}
              />
              <FundTypePopularity chartData={fundPopChartData} />
              <div className="py-2" />
            </div>
          </ScrollArea>
        </div>
      </>
    );
  }
}
```

---

### Step 4: Add Date Selector UI (10 min)

**Option 4A: Simple Form (No client component needed)**

Add above the charts:

```typescript
// In the return statement, before ScrollArea
<div className="flex flex-row sm:h-screen w-screen">
  <SideNavBar />
  <ScrollArea className="w-full h-full">
    {/* Add this date filter form */}
    <form action="/admin/analytics" method="GET" className="p-4 border-b">
      <div className="flex gap-4 items-end">
        <div>
          <label className="text-sm font-semibold">Start Date</label>
          <input
            type="date"
            name="startDate"
            defaultValue={startDate || ""}
            className="border rounded px-2 py-1"
          />
        </div>
        <div>
          <label className="text-sm font-semibold">End Date</label>
          <input
            type="date"
            name="endDate"
            defaultValue={endDate || ""}
            className="border rounded px-2 py-1"
          />
        </div>
        <button type="submit" className="border rounded px-4 py-1">
          Apply
        </button>
        <a href="/admin/analytics" className="border rounded px-4 py-1">
          Clear
        </a>
      </div>
    </form>

    {/* Rest of charts... */}
  </ScrollArea>
</div>
```

**Option 4B: Use Your DateRangeSelector (Requires client wrapper)**

Create a wrapper component:

```typescript
// components/admin/dashboard/analytics-date-filter.tsx
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import DateRangeSelector from "./date-range-selector";
import { format } from "date-fns";

export default function AnalyticsDateFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const startDate = searchParams.get("startDate")
    ? new Date(searchParams.get("startDate")!)
    : null;
  const endDate = searchParams.get("endDate")
    ? new Date(searchParams.get("endDate")!)
    : null;

  const handleDateChange = (start: Date | null, end: Date | null) => {
    const params = new URLSearchParams();
    if (start) params.set("startDate", format(start, "yyyy-MM-dd"));
    if (end) params.set("endDate", format(end, "yyyy-MM-dd"));

    router.push(`/admin/analytics?${params.toString()}`);
  };

  return (
    <div className="p-4 border-b flex justify-between items-center">
      <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
      <DateRangeSelector
        startDate={startDate}
        endDate={endDate}
        onDateChange={handleDateChange}
      />
    </div>
  );
}
```

Then in analytics page:

```typescript
import AnalyticsDateFilter from "@/components/admin/dashboard/analytics-date-filter";

// In return statement:
<div className="flex flex-row sm:h-screen w-screen">
  <SideNavBar />
  <ScrollArea className="w-full h-full">
    <AnalyticsDateFilter />
    {/* Rest of charts... */}
  </ScrollArea>
</div>
```

---

## Summary

### Files to Modify (4-5 files):

1. ✅ `server/supabase/functions/read.ts` - 2 functions
2. ✅ `server/actions/calculations/actions.ts` - 2 functions
3. ✅ `app/admin/analytics/page.tsx` - Add search params, pass dates
4. ✅ `components/admin/dashboard/analytics-date-filter.tsx` - NEW (if using Option 4B)

### Total Time: ~30-50 minutes

### Testing:

1. Navigate to `/admin/analytics` - See all data
2. Navigate to `/admin/analytics?startDate=2025-01-01&endDate=2025-10-21` - See filtered data
3. Only Pre/Post Analysis chart should change
4. Other charts show all-time data

### Pros:

- ✅ Simple implementation
- ✅ No client component conversion (if using Option 4A)
- ✅ Shareable URLs
- ✅ Proves the concept works

### Cons:

- ⚠️ Page reloads on date change
- ⚠️ No loading states
- ⚠️ Other charts not filtered

---

## If It Works, Next Steps:

1. Add date filtering to other charts one by one
2. Add loading states
3. Improve UI/UX
4. Eventually convert to full client component for better experience
