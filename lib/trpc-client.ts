import { createTRPCClient } from "@trpc/client";
import { httpLink } from "@trpc/client/links/httpLink";
import superjson from "superjson";
import type { AppRouter } from "@/app/api/trpc/trpc-router"; // Adjust the import path as necessary

export const trpcClient = createTRPCClient<AppRouter>({
  links: [
    httpLink({
      url: `${process.env.NEXT_PUBLIC_API_URL}/api/trpc`,
    }),
  ],
  transformer: superjson, // Optional: for enhanced serialization support
});
