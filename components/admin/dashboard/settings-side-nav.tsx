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
      <div className="flex flex-col min-h-screen justify-start border-t border-r pt-6 space-y-1">
        <Link href="/admin/settings/agencies">
          <div
            className={`rounded-xl hover:cursor-pointer hover:bg-zinc-200 dark:hover:bg-zinc-800 py-2 px-4 mx-2 text-md font-semibold text-start ${pathname === "/admin/settings/agencies" ? "bg-zinc-200 dark:bg-zinc-800" : ""}`}
          >
            Agencies
          </div>
        </Link>
        <Link href="/admin/settings/email">
          <div
            className={`rounded-xl hover:cursor-pointer hover:bg-zinc-200 dark:hover:bg-zinc-800 py-2 px-4 mx-2 text-md font-semibold text-start ${pathname === "/admin/settings/email" ? "bg-zinc-200 dark:bg-zinc-800" : ""}`}
          >
            Email
          </div>
        </Link>
      </div>
    </>
  );
}
