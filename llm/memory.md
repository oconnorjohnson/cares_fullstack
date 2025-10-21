# LLM Memory - CARES Fullstack

## Recent Changes

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
