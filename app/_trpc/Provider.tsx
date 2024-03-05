"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
// import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import React, { useState } from "react";
import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";
import { trpc } from "./client";

if (typeof window !== "undefined") {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
  });
}

export function CSPostHogProvider({ children }: { children: React.ReactNode }) {
  return <PostHogProvider client={posthog}>{children}</PostHogProvider>;
}

export default function Provider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({}));
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: "https://www.yolopublicdefendercares.org/api/trpc",
          fetch(url, options) {
            return fetch(url, {
              ...options,
              credentials: "include", // Include credentials for cross-origin requests
            });
          },
        }),
        httpBatchLink({
          url: "https://yolopublicdefendercares.org/api/trpc",
          fetch(url, options) {
            return fetch(url, {
              ...options,
              credentials: "include", // Include credentials for cross-origin requests
            });
          },
        }),
      ],
    }),
  );
  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        {/* <ReactQueryDevtools initialIsOpen={false} /> */}
        {children}
      </QueryClientProvider>
    </trpc.Provider>
  );
}
