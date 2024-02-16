"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  HomeIcon,
  GitPullRequestIcon,
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

  return (
    <>
      <div className="flex flex-col min-h-screen justify-start border-t border-r w-1/6 pt-6 space-y-1">
        <Link href="/dashboard">
          <div
            className={`rounded-xl hover:cursor-pointer hover:bg-zinc-200 dark:hover:bg-zinc-800 py-2 px-6 mx-2 text-md font-semibold flex flex-row justify-between items-center ${pathname === "/dashboard" ? "bg-zinc-200 dark:bg-zinc-800" : ""}`}
          >
            Dashboard <HomeIcon className="w-5 h-5" />
          </div>
        </Link>
        <Link href="/user/requests">
          <div
            className={`rounded-xl hover:cursor-pointer hover:bg-zinc-200 dark:hover:bg-zinc-800 py-2 px-6 mx-2 text-md font-semibold flex flex-row justify-between items-center ${pathname === "/user/requests" ? "bg-zinc-200 dark:bg-zinc-800" : ""}`}
          >
            Requests <GitPullRequestIcon className="w-5 h-5" />
          </div>
        </Link>
        <Link href="/user/clients">
          <div
            className={`rounded-xl hover:cursor-pointer hover:bg-zinc-200 dark:hover:bg-zinc-800 py-2 px-6 mx-2 text-md font-semibold flex flex-row justify-between items-center ${pathname === "/user/clients" ? "bg-zinc-200 dark:bg-zinc-800" : ""}`}
          >
            Clients <UsersIcon className="w-5 h-5" />
          </div>
        </Link>
        <Link href="/user/settings">
          <div
            className={`rounded-xl hover:cursor-pointer hover:bg-zinc-200 dark:hover:bg-zinc-800 py-2 px-6 mx-2 text-md font-semibold flex flex-row justify-between items-center ${pathname === "/user/settings" ? "bg-zinc-200 dark:bg-zinc-800" : ""}`}
          >
            Settings <SettingsIcon className="w-5 h-5" />
          </div>
        </Link>
        <Separator />
        <SignOutButton>
          <div className="rounded-xl hover:cursor-pointer hover:bg-zinc-200 dark:hover:bg-zinc-800 py-2 px-6 mx-2 text-md font-semibold flex flex-row justify-between items-center hover:bg-zinc-200 dark:hover:bg-zinc-800">
            Sign Out <LogOutIcon className="w-5 h-5" />
          </div>
        </SignOutButton>
      </div>
    </>
  );
}