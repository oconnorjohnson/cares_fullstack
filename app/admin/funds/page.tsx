import GetFundTypes from "@/components/admin/tables/funds/get-fundTypes";
import { auth } from "@clerk/nextjs";
import CurrentUser from "@/components/shared/current-user";
import NewFundType from "@/components/forms/new-fund-type";
import NewAgency from "@/components/forms/new-agency";
import GetAgencies from "@/components/admin/tables/agencies/get-agencies";
import GetServerRequests from "@/components/admin/tables/requests/page";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { SignOutButton } from "@clerk/nextjs";

export default async function Requests() {
  const { sessionClaims } = auth();
  const isAdmin = (sessionClaims?.publicMetadata as any)?.admin;
  if (!isAdmin) {
    return <div>Not authenticated</div>;
  } else {
    return (
      <>
        <div className="flex flex-row">
          <div className="flex flex-col min-h-screen justify-start border-t border-r w-1/6 pt-6 space-y-1">
            <div className="rounded-xl cursor-pointer py-2 px-6 mx-2 text-md font-semibold flex flex-row justify-between items-center pb-6">
              <CurrentUser />
            </div>
            <Link href="/dashboard">
              <div className="rounded-xl cursor-pointer py-2 px-6 mx-2 text-md font-semibold hover:bg-zinc-200 dark:hover:bg-zinc-800 flex flex-row justify-between items-center">
                Dashboard
                <HomeIcon className="w-5 h-5" />
              </div>
            </Link>
            <Link href="/admin/requests">
              <div className="rounded-xl cursor-pointer py-2 px-6 mx-2 text-md font-semibold hover:bg-zinc-200 dark:hover:bg-zinc-800 flex flex-row justify-between items-center">
                Requests
                <GitPullRequestIcon className="w-5 h-5" />
              </div>
            </Link>
            <Link href="/admin/users">
              <div className="rounded-xl cursor-pointer py-2 px-6 mx-2 text-md font-semibold hover:bg-zinc-200 dark:hover:bg-zinc-800 flex flex-row justify-between items-center">
                Users
                <UsersIcon className="w-5 h-5" />
              </div>
            </Link>
            <Link href="/admin/funds">
              <div className="rounded-xl cursor-pointer py-2 px-6 mx-2 text-md font-semibold bg-zinc-200 dark:bg-zinc-800 flex flex-row justify-between items-center">
                Funds
                <DollarSignIcon className="w-5 h-5" />
              </div>
            </Link>
            <Link href="/admin/stats">
              <div className="rounded-xl cursor-pointer py-2 px-6 mx-2 text-md font-semibold hover:bg-zinc-200 dark:hover:bg-zinc-800 flex flex-row justify-between items-center">
                Stats
                <BarChart2 className="w-5 h-5" />
              </div>
            </Link>
            <Link href="/admin/mail">
              <div className="rounded-xl cursor-pointer py-2 px-6 mx-2 text-md font-semibold hover:bg-zinc-200 dark:hover:bg-zinc-800 flex flex-row justify-between items-center">
                Mail
                <MailIcon className="w-5 h-5" />
              </div>
            </Link>
            <Separator className="my-0.5" />
            <Link href="/admin/settings">
              <div className="rounded-xl cursor-pointer py-2 px-6 mx-2 text-md font-semibold hover:bg-zinc-200 dark:hover:bg-zinc-800 flex flex-row justify-between items-center">
                Settings
                <SettingsIcon className="w-5 h-5" />
              </div>
            </Link>
            <SignOutButton>
              <div className="rounded-xl cursor-pointer py-2 px-6 mx-2 text-md font-semibold hover:bg-zinc-200 dark:hover:bg-zinc-800 flex flex-row justify-between items-center">
                Sign Out
                <LogOutIcon className="w-5 h-5" />
              </div>
            </SignOutButton>
            ;
            <Separator className="my-0.5" />
            <div className="flex flex-col justify-start">
              <div className="flex flex-row px-4 pt-4 pb-2">Got issues?</div>
              <div className="text-sm text-zinc-400 px-4 pb-4">
                Report &apos;em here.
              </div>
              <div className="flex flex-row justify-start space-x-1 pb-4 px-4">
                <Input placeholder="Report bug..." />
                <Button size="icon" variant="ghost">
                  <SendIcon size={15} />
                </Button>
              </div>
            </div>
          </div>
          <div className="flex border-t flex-col w-5/6 items-center justify-start"></div>
        </div>
      </>
    );
  }
}
