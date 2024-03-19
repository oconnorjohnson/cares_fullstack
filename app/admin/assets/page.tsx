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
import AddBussPass from "@/components/admin/assets/add-bus-pass";
import AddArco from "@/components/admin/assets/add-arco";
import AddWalmart from "@/components/admin/assets/add-walmart";

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
          <div className="flex border-t flex-col w-5/6 items-center">
            <div className="flex flex-col justify-center items-center w-full px-8 py-8">
              <div className="text-start text-3xl font-bold pb-4">Assets</div>
              <div className="flex w-full flex-row align-center border border-1 rounded-xl p-4 space-x-4">
                <AddBussPass />
                <AddArco />
                <AddWalmart />
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}
