# Documentation: API, Server, and Database Setup

## Overview

The application uses tRPC for type-safe API routes, Prisma as an ORM for database interactions, Tanstack React Form for form management, React server actions for server-side logic, and Next.js for the app directory and API routes.

## tRPC Setup

tRPC allows for building type-safe APIs on top of your existing Next.js setup. It eliminates the need for manual type definitions for your API requests and responses.

- **API Routes**: tRPC routes are defined in `server/index.ts` using router and publicProcedure from `server/trpc.ts`. Procedures like addClient, getTodos, and getUser are defined here.
- **Client**: The tRPC client is set up in `app/_trpc/client.ts` and is used to make API calls from the frontend.
- **Server Client**: For server-side requests, `app/_trpc/serverClient.ts` is used to call tRPC procedures directly from the server.

## Prisma Setup

Prisma is used as an ORM to interact with the database in a type-safe manner.

- **Schema**: The database schema is defined in `prisma/schema.prisma`. It includes models like User, Client, and Request.
- **Client**: Prisma client is instantiated in `server/index.ts` and used to perform database operations.

## Tanstack React Form

Tanstack React Form is used for managing form state and validation.

- **Form Factory**: `server/form-factories.ts` defines a form factory with default values and server-side validation logic.
- **Form Usage**: In `components/forms/NewClient.tsx`, the form factory is used to create a form with client-side validation and error handling.

## React Server Actions

Server actions are functions that run on the server to handle form submissions and other server-side logic.

- **Actions**: `server/actions.ts` contains the `newClient` function that validates form data using the form factory.

## Next.js App Directory and API Routes

Next.js is used to structure the application and define API routes.

- **App Directory**: The `app` directory contains the frontend code, including pages, components, and the tRPC provider.
- **API Routes**: API routes are defined in the `app/api` directory. For example, `app/api/trpc/[trpc]/route.ts` handles tRPC requests, and `app/api/uploadthing/route.ts` handles file uploads.

## Integration

The components of the system are integrated as follows:

- **API and Server**: tRPC procedures call Prisma client methods to interact with the database.
- **Forms**: Forms on the frontend use Tanstack React Form for state management and call server actions for submissions.
- **Next.js**: Next.js pages and components use the tRPC client to make API requests and display data.

## Example Usage

- **Fetching Data**: `components/admin-dashboard.tsx` uses serverClient to fetch todos from the server.
- **Form Submission**: `components/forms/NewClient.tsx` shows a form that uses `newClientFactory` for state management and validation.

## Middleware

- **Authentication**: `middleware.ts` uses authMiddleware from @clerk/nextjs to protect routes and ensure only authenticated users can access certain parts of the application.

## Deployment

- **Vercel**: The application is set up for deployment on Vercel, as mentioned in `README.md`. The deployment process is streamlined for Next.js applications.

This setup provides a robust, type-safe, and scalable architecture for full-stack development with Next.js.
