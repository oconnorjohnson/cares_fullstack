"use client";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import {
  HomeIcon,
  GitPullRequestIcon,
  BugIcon,
  UsersIcon,
  DollarSignIcon,
  BarChart2,
  MailIcon,
  SettingsIcon,
  LogOutIcon,
  SendIcon,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { SignOutButton } from "@clerk/nextjs";

export default function SideNavBar() {
  const pathname = usePathname();
  const router = useRouter();
  return (
    <>
      <div className="flex flex-col min-h-screen justify-start border-t border-r lg:w-[12.5%] pt-6 space-y-1">
        <Link href="/dashboard">
          <div
            className={`rounded-xl hover:cursor-pointer hover:bg-zinc-200 dark:hover:bg-zinc-800 py-2 px-6 mx-2 text-md font-semibold flex flex-row justify-start gap-2 items-center ${pathname === "/dashboard" ? "bg-zinc-200 " : ""}`}
          >
            <HomeIcon className="w-5 h-5" />
            <span className="hidden lg:block">Dashboard</span>
          </div>
        </Link>

        <Link href="/user/requests">
          <div
            className={`rounded-xl hover:cursor-pointer hover:bg-zinc-200 dark:hover:bg-zinc-800 py-2 px-6 mx-2 text-md font-semibold flex flex-row justify-start gap-2 items-center ${pathname === "/user/requests" ? "bg-zinc-200 " : ""}`}
          >
            <GitPullRequestIcon className="w-5 h-5" />
            <span className="hidden lg:block">Requests</span>
          </div>
        </Link>

        <Link href="/user/clients">
          <div
            className={`rounded-xl hover:cursor-pointer hover:bg-zinc-200 dark:hover:bg-zinc-800 py-2 px-6 mx-2 text-md font-semibold flex flex-row justify-start gap-2 items-center ${pathname === "/user/clients" ? "bg-zinc-200 " : ""}`}
          >
            <UsersIcon className="w-5 h-5" />
            <span className="hidden lg:block">Clients</span>{" "}
          </div>
        </Link>

        <Separator />

        <SignOutButton signOutCallback={() => router.push("/")}>
          <div className="rounded-xl hover:cursor-pointer hover:bg-zinc-200 dark:hover:bg-zinc-800 py-2 px-6 mx-2 text-md font-semibold flex flex-row justify-start gap-2 items-center hover:bg-zinc-200 dark:hover:bg-zinc-800">
            <LogOutIcon className="w-5 h-5" />
            <span className="hidden lg:block">Sign Out</span>{" "}
          </div>
        </SignOutButton>
      </div>
    </>
  );
}
