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
        <Link href="/admin/settings/agencies">
          <div
            className={`rounded-xl hover:cursor-pointer hover:bg-zinc-200 dark:hover:bg-zinc-800 py-2 px-6 mx-2 text-md font-semibold flex flex-row justify-between items-center ${pathname === "/admin/settings/agencies" ? "bg-zinc-200 dark:bg-zinc-800" : ""}`}
          >
            Agencies <HomeIcon className="w-5 h-5" />
          </div>
        </Link>
        <Link href="/admin/settings/fundtypes">
          <div
            className={`rounded-xl hover:cursor-pointer hover:bg-zinc-200 dark:hover:bg-zinc-800 py-2 px-6 mx-2 text-md font-semibold flex flex-row justify-between items-center ${pathname === "/admin/settings/fundtypes" ? "bg-zinc-200 dark:bg-zinc-800" : ""}`}
          >
            Fund Types <GitPullRequestIcon className="w-5 h-5" />
          </div>
        </Link>
      </div>
    </>
  );
}
