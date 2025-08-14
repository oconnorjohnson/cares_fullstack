# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development

```bash
npm run dev          # Start Next.js development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Database Types Generation

After modifying database schema in Supabase:

```bash
npx supabase gen types typescript --project-id [PROJECT_ID] > supabase/types.ts
```

## Architecture Overview

This is a CARES Fullstack application for Yolo County - a community assistance request and fund management system built with Next.js 14, tRPC, and Supabase.

### Core Architecture Patterns

1. **Server Components First**: Use server components by default. Client components only when needed for interactivity.

2. **tRPC for API**: All API endpoints go through tRPC routers in `server/trpc/routers/`. Type-safe from backend to frontend.

3. **Server Actions**: Database operations are organized in `server/actions/` by entity type (client, request, fund, etc.).

4. **Validation**: Use Zod schemas from `server/schemas/` for all form validation and API inputs.

5. **Component Organization**:
   - `components/admin/` - Admin-only components
   - `components/user/` - User-facing components
   - `components/shared/` - Shared between admin and user
   - `components/ui/` - shadcn/ui component library

### Key Business Logic

1. **Dual Fund System**:

   - CARES funds and RFF (Rapid Re-Housing Fund) funds
   - Each has separate balance tracking
   - Fund type ID 3 has special calculation (amount \* 2.5 for display)

2. **Request Workflow**:

   - Clients submit requests → Pre-screening → Admin approval → Fund allocation → Post-screening
   - Requests can have multiple fund allocations
   - Invoice/receipt uploads via Uploadthing

3. **Multi-Agency Support**:
   - System supports multiple agencies
   - Clerk organization IDs map to agency access

### Database Considerations

- Supabase PostgreSQL with Row Level Security
- Types auto-generated in `supabase/types.ts`
- Key tables: clients, requests, funds, assets, invoices, receipts
- Soft deletes implemented (deleted_at timestamps)

### Authentication

- Clerk handles all authentication
- Webhooks in `app/api/clerk/webhooks/route.ts` sync users
- Admin detection via Clerk public metadata

### Email System

- Email templates in `components/emails/`
- Sent via Resend API
- Notifications for request updates, approvals, etc.

### Current Development Priorities (from TODO.md)

- Add age range to client registration
- Better request table filtering
- Export functionality for data analysis
- Enhanced form error handling
- Integration with Amplifund system
