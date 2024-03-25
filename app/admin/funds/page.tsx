import GetFundTypes from "@/components/admin/tables/funds/get-fundTypes";
import { auth } from "@clerk/nextjs";
import CurrentUser from "@/components/shared/current-user";
import NewFundType from "@/components/forms/new-fund-type";
import NewAgency from "@/components/forms/new-agency";
import GetAgencies from "@/components/admin/tables/agencies/get-agencies";
import GetServerRequests from "@/components/admin/tables/requests/page";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
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
import FundsTable from "@/components/admin/tables/funds/page";
import SideNavBar from "@/components/admin/dashboard/side-nav";

export const runtime = "edge";

export default async function Requests() {
  const { sessionClaims } = auth();
  const isAdmin = (sessionClaims?.publicMetadata as any)?.admin;
  if (!isAdmin) {
    return <div>Not authenticated</div>;
  } else {
    return (
      <>
        <div className="flex flex-row">
          <SideNavBar />
          <div className="flex border-t flex-col w-5/6 items-center justify-start">
            <div className="py-4" />
            <FundsTable />
          </div>
        </div>
      </>
    );
  }
}
