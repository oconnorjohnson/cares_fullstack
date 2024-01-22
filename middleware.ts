import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({ publicRoutes: ["/", "/api/webhooks/clerk/create", "/api/webhooks/clerk/delete", "/api/webhooks/clerk/update"]});

export const config = {
  matcher: ["/((?!\\/$|^\\/$|.+\\.[\\w]+$|_next).*)", "/(api|trpc)(.*)"],
};