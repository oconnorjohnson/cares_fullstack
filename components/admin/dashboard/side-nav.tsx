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
  CalendarDaysIcon,
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
            <div className="hidden lg:block">Dashboard </div>
            <HomeIcon className="w-5 h-5" />
          </div>
        </Link>
        <Link href="/admin/requests">
          <div
            className={`rounded-xl hover:cursor-pointer hover:bg-zinc-200 dark:hover:bg-zinc-800 py-2 px-2 lg:px-6 mx-1 lg:mx-2 text-sm lg:text-md font-semibold flex flex-row justify-between items-center ${pathname.startsWith("/admin/requests") ? "bg-zinc-200 dark:bg-zinc-800" : ""}`}
          >
            <div className="hidden lg:block">Requests</div>
            <GitPullRequestIcon className="w-5 h-5" />
          </div>
        </Link>
        <Link href="/admin/pick-ups">
          <div
            className={`rounded-xl hover:cursor-pointer hover:bg-zinc-200 dark:hover:bg-zinc-800 py-2 px-2 lg:px-6 mx-1 lg:mx-2 text-sm lg:text-md font-semibold flex flex-row justify-between items-center ${pathname.startsWith("/admin/pick-ups") ? "bg-zinc-200 dark:bg-zinc-800" : ""}`}
          >
            <div className="hidden lg:block">Pick-Ups</div>
            <CalendarDaysIcon className="w-5 h-5" />
          </div>
        </Link>
        <Link href="/admin/analytics">
          <div
            className={`rounded-xl hover:cursor-pointer hover:bg-zinc-200 dark:hover:bg-zinc-800 py-2 px-2 lg:px-6 mx-1 lg:mx-2 text-sm lg:text-md font-semibold flex flex-row justify-between items-center ${pathname === "/admin/analytics" ? "bg-zinc-200 dark:bg-zinc-800" : ""}`}
          >
            <div className="hidden lg:block">Analytics</div>{" "}
            <BarChart2 className="w-5 h-5" />
          </div>
        </Link>
        <Link href="/admin/users">
          <div
            className={`rounded-xl hover:cursor-pointer hover:bg-zinc-200 dark:hover:bg-zinc-800 py-2 px-2 lg:px-6 mx-1 lg:mx-2 text-sm lg:text-md font-semibold flex flex-row justify-between items-center ${pathname === "/admin/users" ? "bg-zinc-200 dark:bg-zinc-800" : ""}`}
          >
            <div className="hidden lg:block">Users</div>{" "}
            <UsersIcon className="w-5 h-5" />
          </div>
        </Link>
        <Link href="/admin/funds">
          <div
            className={`rounded-xl hover:cursor-pointer hover:bg-zinc-200 dark:hover:bg-zinc-800 py-2 px-2 lg:px-6 mx-1 lg:mx-2 text-sm lg:text-md font-semibold flex flex-row justify-between items-center ${pathname === "/admin/funds" ? "bg-zinc-200 dark:bg-zinc-800" : ""}`}
          >
            <div className="hidden lg:block">Funds</div>{" "}
            <HeartHandshakeIcon className="w-5 h-5" />
          </div>
        </Link>
        <Link href="/admin/assets">
          <div
            className={`rounded-xl hover:cursor-pointer hover:bg-zinc-200 dark:hover:bg-zinc-800 py-2 px-2 lg:px-6 mx-1 lg:mx-2 text-sm lg:text-md font-semibold flex flex-row justify-between items-center ${pathname === "/admin/assets" ? "bg-zinc-200 dark:bg-zinc-800" : ""}`}
          >
            <div className="hidden lg:block">Assets</div>{" "}
            <WalletCardsIcon className="w-5 h-5" />
          </div>
        </Link>
        <Link href="/admin/finances">
          <div
            className={`rounded-xl hover:cursor-pointer hover:bg-zinc-200 dark:hover:bg-zinc-800 py-2 px-2 lg:px-6 mx-1 lg:mx-2 text-sm lg:text-md font-semibold flex flex-row justify-between items-center ${pathname === "/admin/finances" ? "bg-zinc-200 dark:bg-zinc-800" : ""}`}
          >
            <div className="hidden lg:block">Finances</div>{" "}
            <LandmarkIcon className="w-5 h-5" />
          </div>
        </Link>
        <Link href="/admin/settings/agencies">
          <div
            className={`rounded-xl hover:cursor-pointer hover:bg-zinc-200 dark:hover:bg-zinc-800 py-2 px-2 lg:px-6 mx-1 lg:mx-2 text-sm lg:text-md font-semibold flex flex-row justify-between items-center ${pathname === "/admin/settings/agencies" || pathname === "/admin/settings/fundtypes" ? "bg-zinc-200 dark:bg-zinc-800" : ""}`}
          >
            <div className="hidden lg:block">Settings</div>{" "}
            <SettingsIcon className="w-5 h-5" />
          </div>
        </Link>
        <Separator />
        <SignOutButton signOutCallback={() => router.push("/")}>
          <div className="rounded-xl hover:cursor-pointer hover:bg-zinc-200 dark:hover:bg-zinc-800 py-2 px-2 lg:px-6 mx-1 lg:mx-2 text-sm lg:text-md font-semibold flex flex-row justify-between items-center hover:bg-zinc-200 dark:hover:bg-zinc-800">
            <div className="hidden lg:block">Sign Out</div>{" "}
            <LogOutIcon className="w-5 h-5" />
          </div>
        </SignOutButton>
      </div>
    </>
  );
}
