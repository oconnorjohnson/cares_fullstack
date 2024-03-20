"use client";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import {
  HomeIcon,
  GitPullRequestIcon,
  UsersIcon,
  DollarSignIcon,
  HeartHandshakeIcon,
  BarChart2,
  MailIcon,
  LandmarkIcon,
  SettingsIcon,
  LogOutIcon,
  SendIcon,
  WalletCardsIcon,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { SignOutButton } from "@clerk/nextjs";

export default function SideNavBar() {
  const pathname = usePathname();
  const router = useRouter();
  return (
    <>
      <div className="flex flex-col min-h-screen justify-start border-t border-r lg:w-1/6 pt-6 space-y-1">
        <Link href="/dashboard">
          <div
            className={`rounded-xl hover:cursor-pointer hover:bg-zinc-200 dark:hover:bg-zinc-800 py-2 px-2 lg:px-6 mx-1 lg:mx-2 text-sm lg:text-md font-semibold flex flex-row justify-between items-center ${pathname === "/dashboard" ? "bg-zinc-200 dark:bg-zinc-800" : ""}`}
          >
            <span className="hidden lg:block">Dashboard </span>
            <HomeIcon className="w-5 h-5" />
          </div>
        </Link>
        <Link href="/admin/requests">
          <div
            className={`rounded-xl hover:cursor-pointer hover:bg-zinc-200 dark:hover:bg-zinc-800 py-2 px-2 lg:px-6 mx-1 lg:mx-2 text-sm lg:text-md font-semibold flex flex-row justify-between items-center ${pathname.startsWith("/admin/requests") ? "bg-zinc-200 dark:bg-zinc-800" : ""}`}
          >
            <span className="hidden lg:block">Requests</span>
            <GitPullRequestIcon className="w-5 h-5" />
          </div>
        </Link>
        <Link href="/admin/users">
          <div
            className={`rounded-xl hover:cursor-pointer hover:bg-zinc-200 dark:hover:bg-zinc-800 py-2 px-2 lg:px-6 mx-1 lg:mx-2 text-sm lg:text-md font-semibold flex flex-row justify-between items-center ${pathname === "/admin/users" ? "bg-zinc-200 dark:bg-zinc-800" : ""}`}
          >
            <span className="hidden lg:block">Users</span>{" "}
            <UsersIcon className="w-5 h-5" />
          </div>
        </Link>
        <Link href="/admin/funds">
          <div
            className={`rounded-xl hover:cursor-pointer hover:bg-zinc-200 dark:hover:bg-zinc-800 py-2 px-2 lg:px-6 mx-1 lg:mx-2 text-sm lg:text-md font-semibold flex flex-row justify-between items-center ${pathname === "/admin/funds" ? "bg-zinc-200 dark:bg-zinc-800" : ""}`}
          >
            <span className="hidden lg:block">Funds</span>{" "}
            <HeartHandshakeIcon className="w-5 h-5" />
          </div>
        </Link>
        <Link href="/admin/assets">
          <div
            className={`rounded-xl hover:cursor-pointer hover:bg-zinc-200 dark:hover:bg-zinc-800 py-2 px-2 lg:px-6 mx-1 lg:mx-2 text-sm lg:text-md font-semibold flex flex-row justify-between items-center ${pathname === "/admin/assets" ? "bg-zinc-200 dark:bg-zinc-800" : ""}`}
          >
            <span className="hidden lg:block">Assets</span>{" "}
            <WalletCardsIcon className="w-5 h-5" />
          </div>
        </Link>
        <Link href="/admin/finances">
          <div
            className={`rounded-xl hover:cursor-pointer hover:bg-zinc-200 dark:hover:bg-zinc-800 py-2 px-2 lg:px-6 mx-1 lg:mx-2 text-sm lg:text-md font-semibold flex flex-row justify-between items-center ${pathname === "/admin/finances" ? "bg-zinc-200 dark:bg-zinc-800" : ""}`}
          >
            <span className="hidden lg:block">Finances</span>{" "}
            <LandmarkIcon className="w-5 h-5" />
          </div>
        </Link>
        <Link href="/admin/settings/agencies">
          <div
            className={`rounded-xl hover:cursor-pointer hover:bg-zinc-200 dark:hover:bg-zinc-800 py-2 px-2 lg:px-6 mx-1 lg:mx-2 text-sm lg:text-md font-semibold flex flex-row justify-between items-center ${pathname === "/admin/settings/agencies" || pathname === "/admin/settings/fundtypes" ? "bg-zinc-200 dark:bg-zinc-800" : ""}`}
          >
            <span className="hidden lg:block">Settings</span>{" "}
            <SettingsIcon className="w-5 h-5" />
          </div>
        </Link>
        <Separator />
        <SignOutButton signOutCallback={() => router.push("/")}>
          <div className="rounded-xl hover:cursor-pointer hover:bg-zinc-200 dark:hover:bg-zinc-800 py-2 px-2 lg:px-6 mx-1 lg:mx-2 text-sm lg:text-md font-semibold flex flex-row justify-between items-center hover:bg-zinc-200 dark:hover:bg-zinc-800">
            <span className="hidden lg:block">Sign Out</span>{" "}
            <LogOutIcon className="w-5 h-5" />
          </div>
        </SignOutButton>
      </div>
    </>
  );
}
