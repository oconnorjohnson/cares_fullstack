# LLM Memory - CARES Fullstack

## Recent Changes

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
