import { auth } from "@clerk/nextjs";
import CurrentUser from "@/components/shared/current-user";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { FreshPageAlert } from "@/components/shared/alerts";
import SideNavBar from "@/components/admin/dashboard/side-nav";

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
import DashboardPage from "@/components/admin/dashboard/admin-overview";

export default async function Dashboard() {
  const { userId } = auth();
  if (!userId) {
    return <div>Not authenticated</div>;
  } else {
    return (
      <>
        <div className="flex flex-row">
          <SideNavBar />
          <div className="flex border-t flex-col w-5/6">
            <div className="flex flex-col justify-center w-full">
              <FreshPageAlert />
              <DashboardPage />
            </div>
          </div>
        </div>
      </>
    );
  }
}
