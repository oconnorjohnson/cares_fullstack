import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  publicRoutes: [
    "/",
    "/about",
    "/get-help",
    "/get-involved",
    "/api/webhooks/clerk",
    "/api/uploadthing",
    "/api/resend/submitted",
    "/sign-in",
    "/sign-up",
  ],
});

export const config = {
  matcher: ["/((?!\\/$|^\\/$|.+\\.[\\w]+$|_next).*)", "/(api|trpc)(.*)"],
};
