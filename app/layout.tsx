import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@/components/root/theme-provider";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import Providers from "@/app/_trpc/Provider";
import NavBar from "@/components/root/navbar";
import { Toaster } from "@/components/ui/sonner";
import { ourFileRouter } from "@/app/api/uploadthing/core";
import { CSPostHogProvider } from "@/app/_trpc/Provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CARES",
  description: "Supporting the Yolo County Public Defender",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <CSPostHogProvider>
          <body className={inter.className}>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <NextSSRPlugin
                /**
                 * The `extractRouterConfig` will extract **only** the route configs
                 * from the router to prevent additional information from being
                 * leaked to the client. The data passed to the client is the same
                 * as if you were to fetch `/api/uploadthing` directly.
                 */
                routerConfig={extractRouterConfig(ourFileRouter)}
              />
              <Providers>
                <main>
                  <NavBar />
                  {children}
                </main>
                <Toaster />
              </Providers>
            </ThemeProvider>
          </body>
        </CSPostHogProvider>
      </html>
    </ClerkProvider>
  );
}
