# LLM Memory - CARES Fullstack

## Recent Changes

### Sac/Yolo Bus Pass Support - Tue Dec 23 13:03:15 PST 2025

**What changed:**

- Extended bus pass system to support two distinct bus pass types with different pricing:
  - **Sac Bus Pass (FundType 7)**: Sacramento County single fare @ $2.50 each
  - **Yolo Bus Pass (FundType 8)**: Yolo County double fare @ $5.00 each
  - **Legacy Bus Pass (FundType 3)**: Hidden from new requests, honored for pending/historical

**Why this was needed:**

- Yolo County bus no longer accepts Sacramento bus tickets
- Must now purchase separate Yolo bus tickets at $5.00/double fare
- System needed to track both types while preserving historical data

**Implementation details:**

- **Database Migration**: `supabase/migrations/20251223_add_sac_yolo_bus_pass_fund_types.sql`

  - Adds FundType 7 (Sac Bus Pass) and FundType 8 (Yolo Bus Pass)

- **Centralized Constants**: `server/constants/bus-passes.ts`

  - `BUS_PASS_CONFIG` - pricing and FundType ID mappings
  - `getBusPassUnitValue(fundTypeId)` - returns unit price for any bus pass type
  - `isBusPassFundType(fundTypeId)` - checks if FundType is a bus pass
  - `calculateBusPassValue(fundTypeId, amount)` - calculates total value

- **Server Actions Updated**:

  - `server/actions/create/actions.ts` - `addBusPasses()` now accepts `sacAmount` and `yoloAmount`
  - `server/actions/rff/approve.ts` - handlers for FundTypes 7, 8
  - `server/actions/rff/paid.ts` - handlers for FundTypes 7, 8
  - `server/supabase/functions/read.ts` - added `getRFFSacBusPasses()`, `getRFFYoloBusPasses()`
  - `server/supabase/functions/count.ts` - counts now include all bus pass types (3, 7, 8)
  - `server/actions/request/actions.ts` - uses `calculateBusPassValue()` for totals

- **Frontend Updates**:

  - `components/admin/assets/add-bus-pass.tsx` - dual quantity inputs for Sac and Yolo
  - `components/forms/sub-components/fund-select.tsx` - hides FundType 3, validates 7/8
  - Analytics pages group all bus passes under single "Bus Pass" label

- **Testing**: Added Vitest with 26 passing tests for bus pass logic

**Files modified:**

- `supabase/migrations/20251223_add_sac_yolo_bus_pass_fund_types.sql` (NEW)
- `server/constants/bus-passes.ts` (NEW)
- `server/constants/__tests__/bus-passes.test.ts` (NEW)
- `vitest.config.ts` (NEW)
- `vitest.setup.ts` (NEW)
- `server/actions/create/actions.ts`
- `server/actions/rff/approve.ts`
- `server/actions/rff/paid.ts`
- `server/supabase/functions/read.ts`
- `server/supabase/functions/count.ts`
- `server/actions/request/actions.ts`
- `components/admin/assets/add-bus-pass.tsx`
- `components/forms/sub-components/fund-select.tsx`
- `components/admin/tables/requests/page.tsx`
- `app/admin/analytics/page.tsx`
- `app/admin/pick-ups/page.tsx`
- `app/admin/requests/[requestid]/page.tsx`
- `package.json` (added test scripts, vitest dependencies)

**Backward compatibility:**

- Legacy FundType 3 fully supported for existing/pending requests
- Historical transactions remain unchanged
- All existing calculations work correctly

**Database notes:**

- Run migration to add FundTypes 7 and 8 before deploying
- No data migration needed - existing records remain as FundType 3

---

### Post-Screen Process Improvement Question - Thu Nov 6 10:12:03 PST 2025

**What changed:**

- Added new required boolean question to post-screen survey form
- Question asks: "Has the CARES nonprofit increased your ability to assist your clients?"
- Users must select Yes or No before submitting post-screen form

**Implementation details:**

- **Form schema** (`components/forms/post-screen.tsx`):
  - Added `processImproved: z.boolean()` with required_error message
  - Added to form default values as `undefined`
  - New FormField with Select component (Yes/No options)
  - Value conversion: string "true"/"false" → boolean true/false
  - Positioned before submit button, after Additional Information field
- **Server action** (`server/actions/create/actions.ts`):
  - Updated `PostScreenData` interface to include `processImproved: boolean`
- **Database function** (`server/supabase/functions/create.ts`):
  - No changes needed - already uses `TablesInsert<"PostScreenAnswers">` which automatically includes new column

**Database schema:**

- `PostScreenAnswers` table has new column `processImproved: boolean`
- Required field in database schema

**Files modified:**

- `components/forms/post-screen.tsx` - Added form field and schema validation
- `server/actions/create/actions.ts` - Updated interface

**Result:**

- Users must answer whether CARES improved their ability to help clients
- Data flows correctly from form → server action → database
- No linter errors
- Form validation prevents submission without answering

---

### Show Improved Clients as Ratio - Wed Oct 22 11:53:29 PDT 2025

**What changed:**

- Updated Pre/Post Screen Analysis chart to display the ratio of improved clients
- Now shows "X out of Y clients saw improved outcomes" instead of just the count
- Provides context by showing improvement rate within selected date range

**Implementation details:**

- **Supabase function** (`server/supabase/functions/count.ts`):
  - Modified return type to include `total: number`
  - Counts valid records (those with both pre and post screens)
  - Returns `{ decreased, increased, total }`
- **Server action** (`server/actions/calculations/actions.ts`):
  - Updated return type to include `total: number`
  - Passes through the total count
- **Analytics page** (`app/admin/analytics/page.tsx`):
  - Pass `totalCount={prePostChanges.total}` to component
- **Chart component** (`components/admin/dashboard/pre-post-analysis.tsx`):
  - Added `totalCount` optional prop
  - Display: **"X out of Y clients saw improved outcomes (decreased scores)"**
  - Proper pluralization for "client/clients"
  - Shows ratio only when both values available

**Result:**

- Users now see the improvement rate, e.g., "5 out of 8 clients improved"
- Provides better context for understanding program effectiveness
- Filters by date range automatically

---

### Add Improved Outcomes Count to Pre/Post Chart - Tue Oct 21 16:14:24 PDT 2025

**What changed:**

- Enhanced Pre/Post Screen Analysis chart to show count of requests with improved outcomes
- Added date range filtering to the decreased/increased scores calculation
- Displays the number of requests where post-survey scores were lower than pre-survey scores (indicating improvement)

**Why this matters:**

- Lower scores = better outcomes (less stress, better situation)
- This metric shows how many clients actually improved after receiving aid
- Now respects the date range filter to show improvements within selected timeframe

**Implementation details:**

- **Supabase function** (`server/supabase/functions/count.ts`):
  - Updated `countPrePostScreenChanges(startDate?, endDate?)` to accept date parameters
  - Filters Request table by `created_at` if dates provided
  - Calculates sum of pre-survey scores vs sum of post-survey scores
  - Returns count of decreased (improved) and increased scores
- **Server action** (`server/actions/calculations/actions.ts`):
  - Updated `GetPrePostScreenChanges(startDate?, endDate?)` to pass date parameters
- **Analytics page** (`app/admin/analytics/page.tsx`):
  - Pass date parameters to `GetPrePostScreenChanges(startDate, endDate)`
  - Pass `decreasedCount` prop to PrePostAnalysis component
- **Chart component** (`components/admin/dashboard/pre-post-analysis.tsx`):
  - Added optional `decreasedCount` prop
  - Display count in CardFooter description
  - Shows "[N] requests saw improved outcomes (decreased scores)"
  - Adds TrendingUp icon when count is available

**Files modified:**

- `server/supabase/functions/count.ts` - Added date filtering to countPrePostScreenChanges
- `server/actions/calculations/actions.ts` - Pass date params through server action
- `app/admin/analytics/page.tsx` - Pass dates and decreasedCount
- `components/admin/dashboard/pre-post-analysis.tsx` - Display the count

**Score logic:**

- Sum of 8 categories: housing (2), food (2), transportation (2), utility, financial
- Lower scores = better situation (less stress/difficulties)
- Decreased score = improved outcome = success

**Result:**

- Chart now shows both average scores AND count of improved clients
- Filters by date range automatically
- Provides concrete success metric for the program

---

### Convert Race Chart to Pie Chart - Tue Oct 21 14:58:18 PDT 2025

**What changed:**

- Converted "Requests by Client Race" chart from horizontal bar chart to pie chart
- Fixed display issue where bars weren't showing
- Added distinct colors for each race category
- Added center label showing total request count

**Implementation details:**

- Changed from `BarChart` to `PieChart` with donut layout (innerRadius: 60)
- Added individual color mappings for each race category in chartConfig:
  - White: chart-1
  - Hispanic / Latino: chart-2
  - African American / Black: chart-3
  - Asian: chart-4
  - Native American / Alaska Native: chart-5
  - Pacific Islander, Two or More Races, Other, Unknown: additional colors
- Center label displays total request count
- Tooltip shows race name, count, and percentage
- Added console.log for debugging data

**Files modified:**

- `components/admin/dashboard/requests-by-race.tsx` - Complete rewrite from bar to pie chart

**Why the bar chart wasn't working:**

- The horizontal bar chart likely had data but wasn't displaying bars properly
- Pie chart is better suited for showing percentage breakdowns anyway
- Now matches the style of other charts like "Requests Per Agency"

---

### New Requests by Client Race Chart - Tue Oct 21 14:50:16 PDT 2025

**What changed:**

- Replaced "Requests Per Process Stage" chart with new "Requests by Client Race" chart
- Shows breakdown of requests by client demographics (race column from Client table)
- Includes date range filtering from the start
- Built across the full stack following established patterns

**Implementation details:**

- **Supabase function** (`server/supabase/functions/read.ts`):
  - Added `getRequestsByClientRace(startDate?, endDate?)` function
  - Joins Request and Client tables using `Client!inner(race)`
  - Filters by created_at date range if provided
  - Returns array with race, count, and percentage
  - Sorts by count descending
- **Server action** (`server/actions/calculations/actions.ts`):
  - Added `GetRequestsByClientRace(startDate?, endDate?)` action
  - Includes authentication check
  - Wraps Supabase function
- **Chart component** (`components/admin/dashboard/requests-by-race.tsx`):
  - Created new client component
  - Uses horizontal bar chart (BarChart from recharts)
  - Shows count and percentage in tooltip
  - Y-axis displays race categories
  - X-axis shows request counts
- **Analytics page** (`app/admin/analytics/page.tsx`):
  - Added `GetRequestsByClientRace` to imports
  - Added to Promise.all with date parameters
  - Replaced `<PercentRequestStatus>` with `<RequestsByRace>`
  - Removed unused PercentRequestStatus import

**Files modified:**

- `server/supabase/functions/read.ts` - Added getRequestsByClientRace function
- `server/actions/calculations/actions.ts` - Added GetRequestsByClientRace action
- `components/admin/dashboard/requests-by-race.tsx` (NEW) - Chart component
- `app/admin/analytics/page.tsx` - Integrated new chart with date filtering

**Database schema:**

- Request table has `clientId` foreign key to Client table
- Client table has `race: string` column
- Join performed using `Client!inner(race)` syntax

**Result:**

- New chart shows demographic breakdown of all requests
- Date filtering works out of the box (uses same date range selector)
- Follows same pattern as Pre/Post Analysis chart
- Backward compatible with optional date parameters

---

### Date Range Selector Simplification - Tue Oct 21 13:35:10 PDT 2025

**What changed:**

- Simplified DateRangeSelector UI by removing Quick Select presets and all labels
- Cleaner, more minimalist interface with just two calendars and action buttons

**Changes made:**

1. **Removed Quick Select sidebar** - Deleted all preset buttons (Last 7/30/90 days, This Year, All Time)
2. **Removed calendar labels** - Removed "Start Date" and "End Date" text above calendars
3. **Hidden calendar title** - Set `caption_label: "hidden"` in Calendar component to hide "October 2025" text
4. **Removed unused code** - Cleaned up unused imports (subDays, startOfYear, endOfDay) and preset-related functions

**Files modified:**

- `components/admin/dashboard/date-range-selector.tsx` - Removed presets and labels
- `components/ui/calendar.tsx` - Hidden caption label

**Result:**

- Users now see only the month/year dropdowns and calendar grids
- Apply, Cancel, and Clear buttons remain at the bottom
- Much cleaner, less cluttered interface

---

### Date Range Selector UI Fixes - Tue Oct 21 13:14:47 PDT 2025

**What changed:**

- Fixed multiple UX issues with DateRangeSelector component
- Quick select buttons now work properly
- Reduced component height and improved layout
- Fixed month/year dropdown contrast issues

**Issues fixed:**

1. **Quick select buttons** - Now auto-apply and close popover immediately when clicked
2. **Height issue** - Changed layout from vertical to horizontal (side-by-side calendars), added max-height and scrolling
3. **Dropdown contrast** - Added custom styling to month/year select dropdowns for better readability

**Implementation details:**

- Updated `handlePresetClick` to call `onDateChange` and close popover immediately
- Changed calendar layout from `space-y-4` (vertical) to `flex gap-4` (horizontal)
- Added `max-h-[600px] overflow-y-auto` to PopoverContent for scrollability
- Added custom classNames to Calendar component for dropdown styling:
  - `caption_dropdowns`: flex layout with gap
  - `dropdown`: proper background, text color, border, and focus states
  - `dropdown_month` and `dropdown_year`: ensure foreground text color

**Files modified:**

- `components/admin/dashboard/date-range-selector.tsx`
- `components/ui/calendar.tsx`

---

### Analytics Date Filtering for Pre/Post Chart - Tue Oct 21 13:08:13 PDT 2025

**What changed:**

- Added date range filtering to Pre/Post Analysis chart on analytics page
- Created DateRangeSelector component with year/month dropdowns
- Implemented as proof of concept - only affects Pre/Post chart, other charts show all-time data

**Implementation details:**

- **Server-side focused** - Analytics page remains server component for simplicity
- **Optional date parameters** - All changes backward compatible with null defaults
- Created reusable `DateRangeSelector` component:
  - Popover with two calendars (start/end date)
  - Year and month dropdown selectors (2020-present)
  - Quick presets: Last 7/30/90 days, This Year, All Time
  - Smart validation (no future dates, start < end)
- Created `AnalyticsDateFilter` client wrapper component
- Updated Supabase functions:
  - `getAllPreScreenAnswers(startDate?, endDate?)`
  - `getAllPostScreenAnswers(startDate?, endDate?)`
- Updated server actions:
  - `getPreScreenAverages(startDate?, endDate?)`
  - `getPostScreenAverages(startDate?, endDate?)`
- Analytics page reads date params from URL search params
- Page reloads when dates change (server component behavior)

**Files modified:**

- `components/admin/dashboard/date-range-selector.tsx` (new)
- `components/admin/dashboard/analytics-date-filter.tsx` (new)
- `server/supabase/functions/read.ts` (2 functions updated)
- `server/actions/calculations/actions.ts` (2 functions updated)
- `app/admin/analytics/page.tsx` (accepts searchParams, passes dates)

**URL structure:**

- `/admin/analytics` - Shows all-time data
- `/admin/analytics?startDate=2025-01-01&endDate=2025-10-21` - Shows filtered data

**Future expansion:**

- Can easily extend date filtering to other charts by following same pattern
- Consider converting to client component later for better UX (no page reloads)
- All functions already support optional date params

**Production safety:**

- All date params optional with null defaults (backward compatible)
- No breaking changes to existing functionality
- Tested with no linter errors

---

### Editable Implementation & Sustainability Fields - Tue Oct 21 12:43:44 PDT 2025

**What changed:**

- Added inline editing capability for implementation and sustainability fields in admin request detail page
- Admins can now edit the "Plan for Implementation" and "Plan for Sustainability" directly from the request page

**Implementation details:**

- Created reusable `EditableTextField` component (`components/admin/request/editable-text-field.tsx`)
  - Client component with edit/view modes
  - Uses Textarea for editing
  - Includes Save/Cancel buttons with loading states
  - Shows toast notifications on success/error
- Added Supabase functions:
  - `updateRequestImplementation()` in `server/supabase/functions/update.ts`
  - `updateRequestSustainability()` in `server/supabase/functions/update.ts`
- Added server actions in `server/actions/update/actions.ts`:
  - `updateRequestImplementation()` - updates implementation field with auth check
  - `updateRequestSustainability()` - updates sustainability field with auth check
- Updated `app/admin/requests/[requestid]/page.tsx` to use EditableTextField component

**Files modified:**

- `components/admin/request/editable-text-field.tsx` (new)
- `server/supabase/functions/update.ts`
- `server/actions/update/actions.ts`
- `app/admin/requests/[requestid]/page.tsx`

**User experience:**

- Click pencil icon to enter edit mode
- Edit text in textarea
- Click Save to persist changes or Cancel to revert
- Real-time validation (cannot be empty)
- Toast notifications for feedback

---

### Client Form Updates - Tue Oct 21 11:43:41 PDT 2025

**What changed:**

- Added `age` and `zip` fields to the Client creation form
- Updated `components/forms/new-client.tsx` to include age and ZIP code inputs

**Implementation details:**

- Added validation to form schema:
  - Age: Integer between 0-120
  - ZIP: 5-digit number (10000-99999)
- Form fields use `type="number"` inputs with proper validation
- Used `z.coerce.number()` for automatic string-to-number conversion
- No changes needed to `server/actions/create/actions.ts` - the `newClient` action already accepts `TablesInsert<"Client">` which automatically includes the new database columns

**Files modified:**

- `components/forms/new-client.tsx`

**Database schema:**

- `Client` table now includes `age: number` and `zip: number` columns
