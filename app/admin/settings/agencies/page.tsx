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
import { FreshPageAlert } from "@/components/shared/alerts";
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
import FundTypes from "@/components/admin/tables/fund-types/page";
import AgencyTypes from "@/components/admin/tables/agencies/page";
import AddAgency from "@/components/forms/new-agency";
import AddFundType from "@/components/forms/new-fund-type";
import SideNavBar from "@/components/admin/dashboard/side-nav";
import SettingsSideNav from "@/components/admin/dashboard/settings-side-nav";

export default async function Requests() {
  const { sessionClaims, userId } = auth();
  const isAdmin = (sessionClaims?.publicMetadata as any)?.admin;
  const user = userId;
  if (!isAdmin || !user) {
    return <div>Not authenticated</div>;
  } else {
    return (
      <div className="flex flex-row">
        <SideNavBar />
        <SettingsSideNav />
        <div className="flex border-t flex-col w-5/6 ">
          <div className="flex flex-col justify-center w-full">
            <div className="flex flex-row items-start justify-center space-x-12 px-10 pt-12">
              <div className="flex flex-col justify-center space-y-8">
                <AddAgency userId={user} />
                <div className="border-2 rounded-xl w-full">
                  <AgencyTypes />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
