# Analytics Date Filtering Implementation Plan

## Overview

Add date range filtering to the admin analytics page using URL search params and a client-side date picker. This allows admins to view analytics data for specific time periods while maintaining shareable URLs.

## Architecture Decision: Option 1 - Client Component with Search Params

**Why this approach?**

- ✅ Shareable URLs with date ranges
- ✅ Clean separation of client/server logic
- ✅ Progressive enhancement (works without JS)
- ✅ Easy to add loading states
- ✅ Follows Next.js 14 best practices

## Implementation Phases

### Phase 1: Setup & Infrastructure (1-2 hours)

#### 1.1 Create Date Range Selector Component

**File:** `components/admin/dashboard/date-range-selector.tsx`

**Features:**

- Popover with two calendars (start date, end date)
- Preset options: "Last 7 days", "Last 30 days", "Last 90 days", "This Year", "All Time"
- Reset button
- Visual indicator showing current date range

**Dependencies:**

- `@/components/ui/popover`
- `@/components/ui/calendar`
- `@/components/ui/button`
- `date-fns` for date formatting

**Interface:**

```typescript
interface DateRangeProps {
  startDate?: Date | null;
  endDate?: Date | null;
  onDateChange: (start: Date | null, end: Date | null) => void;
}
```

#### 1.2 Convert Analytics Page to Client Component

**File:** `app/admin/analytics/page.tsx`

**Changes:**

- Add `"use client"` directive
- Import `useSearchParams`, `useRouter`, `usePathname` from `next/navigation`
- Import `useState`, `useEffect` from React
- Move data fetching to `useEffect` or React Query
- Add loading and error states

**URL Structure:**

```
/admin/analytics?startDate=2025-01-01&endDate=2025-10-21
/admin/analytics (defaults to "All Time")
```

---

### Phase 2: Update Server Actions (3-4 hours)

#### 2.1 Update All Actions to Accept Date Parameters

**File:** `server/actions/calculations/actions.ts`

**Pattern to follow for each action:**

```typescript
// BEFORE:
export async function GetTotalRFFDollarsSpent() {
  const { userId } = auth();
  if (!userId) throw new Error("User not authenticated");
  const totalDollars = await getTotalRFFDollarsSpent();
  return totalDollars;
}

// AFTER:
export async function GetTotalRFFDollarsSpent(
  startDate?: string | null,
  endDate?: string | null,
) {
  const { userId } = auth();
  if (!userId) throw new Error("User not authenticated");
  const totalDollars = await getTotalRFFDollarsSpent(startDate, endDate);
  return totalDollars;
}
```

**Actions to update:**

1. ✅ `GetTotalRFFDollarsSpent(startDate?, endDate?)`
2. ✅ `GetDollarsSpentByFundType(startDate?, endDate?)`
3. ✅ `GetPercentageOfRequestsByFundType(startDate?, endDate?)`
4. ✅ `GetPercentageOfRequestsByAgency(startDate?, endDate?)`
5. ✅ `GetPercentageOfRequestsByStatus(startDate?, endDate?)`
6. ✅ `GetSDOHPercentages(startDate?, endDate?)`
7. ✅ `GetPrePostScreenChanges(startDate?, endDate?)`
8. ✅ `GetPaidFundPercentagesByRace(startDate?, endDate?)`
9. ✅ `GetIncreasedScoresAnalysis(startDate?, endDate?)`
10. ✅ `GetPrePostPostChangeClientCount(startDate?, endDate?)`
11. ✅ `getPreScreenAverages(startDate?, endDate?)`
12. ✅ `getPostScreenAverages(startDate?, endDate?)`

**File:** `server/actions/count/actions.ts`

13. ✅ `CountRequestsCompleted(startDate?, endDate?)`

**Note:** Make dates optional with defaults to null to maintain backward compatibility.

---

### Phase 3: Update Supabase Functions (4-5 hours)

#### 3.1 Add Date Filtering Helper

**File:** `server/supabase/functions/read.ts` (add at top)

```typescript
/**
 * Applies date range filter to a Supabase query builder
 * Filters by the 'created_at' column
 */
function applyDateRangeFilter(
  query: any,
  startDate?: string | null,
  endDate?: string | null,
  dateColumn: string = "created_at",
) {
  if (startDate) {
    query = query.gte(dateColumn, startDate);
  }
  if (endDate) {
    // Add one day to endDate to include the entire end date
    const endDateInclusive = new Date(endDate);
    endDateInclusive.setDate(endDateInclusive.getDate() + 1);
    query = query.lt(dateColumn, endDateInclusive.toISOString().split("T")[0]);
  }
  return query;
}
```

#### 3.2 Update Supabase Read Functions

**File:** `server/supabase/functions/read.ts`

**Functions to update (17 total):**

1. **getTotalRFFDollarsSpent**

   - Table: `Fund`
   - Date column: Join to `Request.created_at`
   - Filter: `paid = true` AND date range

2. **dollarsSpentByFundType**

   - Table: `Fund`
   - Date column: Join to `Request.created_at`
   - Filter: `paid = true` AND date range

3. **getPercentageOfRequestsByFundType**

   - Table: `Request`
   - Date column: `created_at`
   - Filter: `approved = true` AND date range

4. **getPercentageOfRequestsByAgency**

   - Table: `Request`
   - Date column: `created_at`
   - Filter: `approved = true` AND date range

5. **getPercentageOfRequestsByStatus**

   - Table: `Request`
   - Date column: `created_at`
   - Filter: date range only

6. **getSDOHPercentages**

   - Table: `Request`
   - Date column: `created_at`
   - Filter: `SDOH IS NOT NULL` AND date range

7. **getAllPreScreenAnswers**

   - Table: `PreScreenAnswers`
   - Date column: `created_at`
   - Filter: date range only

8. **getAllPostScreenAnswers**
   - Table: `PostScreenAnswers`
   - Date column: `created_at`
   - Filter: date range only

**Example Update:**

```typescript
// BEFORE:
export async function getTotalRFFDollarsSpent() {
  const supabase = createSupabaseClient();
  try {
    const { data, error } = await supabase
      .from("Fund")
      .select("amount")
      .eq("isRFF", true)
      .eq("paid", true);
    // ... rest of logic
  }
}

// AFTER:
export async function getTotalRFFDollarsSpent(
  startDate?: string | null,
  endDate?: string | null
) {
  const supabase = createSupabaseClient();
  try {
    // Need to join with Request table to filter by request date
    let query = supabase
      .from("Fund")
      .select(`
        amount,
        Request!inner(created_at)
      `)
      .eq("isRFF", true)
      .eq("paid", true);

    // Apply date filters to Request.created_at
    if (startDate) {
      query = query.gte("Request.created_at", startDate);
    }
    if (endDate) {
      const endDateInclusive = new Date(endDate);
      endDateInclusive.setDate(endDateInclusive.getDate() + 1);
      query = query.lt("Request.created_at", endDateInclusive.toISOString().split('T')[0]);
    }

    const { data, error } = await query;
    // ... rest of logic
  }
}
```

#### 3.3 Update Count Functions

**File:** `server/supabase/functions/count.ts`

**Functions to update:**

1. **countPrePostScreenChanges**
   - Table: `Request` with joins
   - Date column: `Request.created_at`
2. **countPaidFundsByRace**

   - Table: `Fund` with joins
   - Date column: Join to `Request.created_at`

3. **analyzeIncreasedScores**

   - Table: `Request` with joins
   - Date column: `Request.created_at`

4. **countTotalRequests** (if needed)
   - Table: `Request`
   - Date column: `created_at`

---

### Phase 4: Frontend Integration (2-3 hours)

#### 4.1 Update Analytics Page Component

**File:** `app/admin/analytics/page.tsx`

**Structure:**

```typescript
"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { format } from "date-fns";
import DateRangeSelector from "@/components/admin/dashboard/date-range-selector";
// ... other imports

export default function Analytics() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Parse dates from URL
  const [startDate, setStartDate] = useState<Date | null>(() => {
    const start = searchParams.get("startDate");
    return start ? new Date(start) : null;
  });

  const [endDate, setEndDate] = useState<Date | null>(() => {
    const end = searchParams.get("endDate");
    return end ? new Date(end) : null;
  });

  const [isLoading, setIsLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState<any>(null);

  // Update URL when dates change
  const handleDateChange = (start: Date | null, end: Date | null) => {
    setStartDate(start);
    setEndDate(end);

    const params = new URLSearchParams(searchParams);
    if (start) {
      params.set("startDate", format(start, "yyyy-MM-dd"));
    } else {
      params.delete("startDate");
    }
    if (end) {
      params.set("endDate", format(end, "yyyy-MM-dd"));
    } else {
      params.delete("endDate");
    }

    router.push(`${pathname}?${params.toString()}`);
  };

  // Fetch data when dates change
  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const startStr = startDate ? format(startDate, "yyyy-MM-dd") : null;
        const endStr = endDate ? format(endDate, "yyyy-MM-dd") : null;

        const [
          totalRequests,
          percentagesByAssetTypeAndAgency,
          // ... all other data fetches with date params
        ] = await Promise.all([
          CountRequestsCompleted(startStr, endStr),
          GetPercentageOfRequestsByFundType(startStr, endStr),
          // ... pass dates to all actions
        ]);

        setAnalyticsData({
          totalRequests,
          percentagesByAssetTypeAndAgency,
          // ... store all data
        });
      } catch (error) {
        console.error("Error fetching analytics:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [startDate, endDate]); // Re-fetch when dates change

  if (isLoading) {
    return <div>Loading analytics...</div>;
  }

  return (
    <div className="flex flex-row sm:h-screen w-screen">
      <SideNavBar />
      <ScrollArea className="w-full h-full">
        {/* Add Date Range Selector in header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
          <DateRangeSelector
            startDate={startDate}
            endDate={endDate}
            onDateChange={handleDateChange}
          />
        </div>

        {/* Render charts with filtered data */}
        <div className="flex flex-col sm:grid sm:grid-cols-3 gap-4 py-4 px-4">
          {/* Pass analyticsData to child components */}
        </div>
      </ScrollArea>
    </div>
  );
}
```

#### 4.2 Add Loading States

**Options:**

1. Full-page loading spinner
2. Skeleton loaders for each chart
3. Disable interactions during load

**Recommended:** Skeleton loaders for better UX

---

### Phase 5: Testing & Edge Cases (1-2 hours)

#### 5.1 Test Cases

**Functional Tests:**

- ✅ Select date range and verify data updates
- ✅ Use preset date ranges (Last 7 days, etc.)
- ✅ Clear date filters (show all data)
- ✅ Share URL with date params - verify it works on page load
- ✅ Invalid date ranges (start > end)
- ✅ Future dates
- ✅ Very old dates with no data

**Edge Cases:**

- ✅ Start date only (no end date)
- ✅ End date only (no start date)
- ✅ Same start and end date (single day)
- ✅ Date ranges spanning years
- ✅ Empty result sets
- ✅ Performance with large date ranges

**Browser Tests:**

- ✅ Direct URL navigation
- ✅ Back/forward buttons
- ✅ Bookmark functionality
- ✅ Page refresh maintains state

#### 5.2 Performance Considerations

**Potential Issues:**

1. **Slow queries with date filters**

   - Solution: Ensure `created_at` columns are indexed
   - Add database index: `CREATE INDEX idx_request_created_at ON "Request"(created_at);`

2. **Multiple parallel queries**

   - Solution: Already using `Promise.all()` - good!
   - Consider adding request debouncing if date picker updates too frequently

3. **Large datasets**
   - Solution: Consider adding pagination or data limits
   - Show warning for date ranges > 1 year

---

### Phase 6: Polish & Documentation (1 hour)

#### 6.1 User Experience Improvements

**Visual Feedback:**

- Show selected date range prominently
- Display "Showing data from X to Y" message
- Add tooltip explaining date filtering
- Show empty states when no data in date range

**Accessibility:**

- Ensure date picker is keyboard navigable
- Add ARIA labels
- Screen reader support for date range changes

#### 6.2 Documentation

**Update Files:**

1. `app/admin/analytics/notes.md` - Add date filtering documentation
2. `llm/memory.md` - Document the implementation
3. Add inline code comments for complex date logic

---

## Migration Strategy

### Approach: Incremental Implementation

**Week 1: Foundation**

- ✅ Create DateRangeSelector component
- ✅ Update 3-4 simple functions as proof of concept
- ✅ Test end-to-end with subset of data
- ✅ Get user feedback

**Week 2: Bulk Updates**

- ✅ Update remaining server actions
- ✅ Update all Supabase functions
- ✅ Integration testing

**Week 3: Polish**

- ✅ Add loading states
- ✅ Performance optimization
- ✅ Final testing and deployment

---

## File Modification Summary

### New Files (1):

- `components/admin/dashboard/date-range-selector.tsx`
- `app/admin/analytics/IMPLEMENTATION_PLAN.md` (this file)

### Modified Files (4):

1. `app/admin/analytics/page.tsx` - Convert to client component, add date picker
2. `server/actions/calculations/actions.ts` - Add date params to 12 functions
3. `server/actions/count/actions.ts` - Add date params to 1 function
4. `server/supabase/functions/read.ts` - Add date filtering to 8 functions
5. `server/supabase/functions/count.ts` - Add date filtering to 3 functions

**Total Functions to Update:** ~24 functions

---

## Risk Mitigation

### High Risk Areas:

1. **Breaking Existing Functionality**

   - Mitigation: Make date params optional with null defaults
   - Test all existing flows without date filters

2. **Performance Degradation**

   - Mitigation: Add database indexes before deployment
   - Monitor query performance
   - Set reasonable date range limits

3. **Date Timezone Issues**

   - Mitigation: Use consistent timezone (UTC) throughout
   - Format dates consistently (ISO 8601)
   - Test with different user timezones

4. **Type Safety**
   - Mitigation: Use TypeScript strictly
   - Define clear date param types
   - Add runtime validation for date strings

---

## Success Criteria

### Must Have:

- ✅ Date range selector works correctly
- ✅ All charts filter by selected date range
- ✅ URLs are shareable
- ✅ No breaking changes to existing functionality
- ✅ Page performance remains acceptable (<3s load)

### Nice to Have:

- ✅ Preset date ranges
- ✅ Loading skeletons
- ✅ Empty state handling
- ✅ Export filtered data option

---

## Estimated Timeline

**Total: 12-17 hours**

- Phase 1: 1-2 hours
- Phase 2: 3-4 hours
- Phase 3: 4-5 hours
- Phase 4: 2-3 hours
- Phase 5: 1-2 hours
- Phase 6: 1 hour

**Recommended Schedule:**

- Session 1 (3-4 hours): Phases 1 & 2
- Session 2 (4-5 hours): Phase 3
- Session 3 (3-4 hours): Phases 4 & 5
- Session 4 (1-2 hours): Phase 6 & deployment

---

## Next Steps

1. **Review this plan** - Make any adjustments
2. **Set up feature branch** - `git checkout -b feature/analytics-date-filtering`
3. **Start with Phase 1** - Build DateRangeSelector component
4. **Implement incrementally** - Test after each phase
5. **Deploy to staging** - Get user feedback
6. **Deploy to production** - Monitor performance

---

## Questions to Answer Before Starting

1. What should the default date range be? (Last 30 days? All time?)
2. Should there be a maximum date range limit?
3. Do we need to filter by fiscal year or calendar year?
4. Should the date filter apply to `Request.created_at` or other date fields?
5. Do we want to add export functionality for filtered data?

---

## Alternative: Simplified Phase 1 POC

If full implementation seems too large, consider a **2-hour proof of concept**:

1. Create DateRangeSelector component
2. Update ONLY `GetTotalRFFDollarsSpent()` function
3. Add date filtering to ONE chart
4. Verify the approach works end-to-end

This allows validation of the approach before committing to the full implementation.
