import {
  createServerClient,
  CookieOptionsWithName,
  CookieMethods,
} from "@supabase/ssr";
import { Database } from "@/types_db";

// Supabase createServerClient requires a cookie methods implementation for authentication purposes
// We are using Clerk for authentication, so we can use a placeholder to satisfy the type checker
// This is a minimal implementation that has no operations and returns null for all methods

const cookieMethods: CookieMethods = {
  set: () => {},
};

const cookieOptions: CookieOptionsWithName = {
  name: "supabase.auth.token",
  domain: "",
  path: "/",
  sameSite: "lax",
};

export const createClient = () => {
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: cookieMethods,
      cookieOptions: cookieOptions,
    },
  );
};
