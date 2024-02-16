import { auth } from "@clerk/nextjs";
import NewClient from "@/components/forms/new-client";
import GetClients from "@/components/user/get-clients";
import NewRequest from "@/components/forms/new-request";
import CurrentUser from "@/components/shared/current-user";
import GetRequests from "@/components/user/tables/requests/page";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { FreshPageAlert } from "@/components/shared/alerts";
import SideNavBar from "@/components/user/dashboard/side-nav";

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

export default function Dashboard() {
  const { userId } = auth();
  console.log(userId);
  if (!userId) {
    return <div>User not authenticated!</div>;
  } else {
    return (
      <>
        <div className="flex flex-row">
          <SideNavBar />
          <div className="flex border-t flex-col w-5/6">
            <div className="flex flex-row justify-between py-6"></div>
            <div className="text-3xl font-bold pl-12">My Dashboard</div>
          </div>
        </div>
      </>
    );
  }
}
