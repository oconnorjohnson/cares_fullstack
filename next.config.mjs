import { withSentryConfig } from "@sentry/nextjs";
/** @type {import('next').NextConfig} */
const nextConfig = {};

export default withSentryConfig(
  nextConfig,
  {
    silent: true,
    org: "daniel-johnson",
    project: "javascript-nextjs",
  },
  {
    widenClientFileUpload: true,
    transpileClientSDK: true,
    tunnelRoute: "/monitoring",
    hideSourceMaps: true,
    disableLogger: true,
    automaticVercelMonitors: true,
  },
);
