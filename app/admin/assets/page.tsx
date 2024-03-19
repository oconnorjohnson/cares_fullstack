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
            <div className="flex flex-row justify-between w-full px-8 py-8 space-x-8">
              <div className="flex w-2/5 flex-col items-center justify-start align-center border border-1 rounded-xl p-4 space-y-4">
                <div className="w-full text-start text-2xl font-bold">
                  Add Assets
                </div>
                <AddBussPass />
                <AddArco />
                <AddWalmart />
              </div>
              <div className="flex w-1/5 flex-col items-center justify-start align-center border border-1 rounded-xl p-4">
                <div className="w-full text-start text-2xl font-bold">
                  Bus Passes
                </div>
                <div className="flex items-center h-full text-3xl font-bold ">
                  <div className="border border-1 rounded-xl p-4">123</div>
                </div>
              </div>
              <div className="flex w-2/5 flex-col items-start justify-start align-center border border-1 rounded-xl p-4 space-y-4">
                <div className="w-full text-start text-2xl font-bold">
                  Gift Cards
                </div>
                <div className="flex flex-row space-x-4">
                  <div className="border border-1 rounded-2xl text-semibold p-4">
                    Arco Gift Cards Total Value
                  </div>
                  <div className="border border-1 rounded-2xl text-semibold p-4">
                    $1500
                  </div>
                </div>
                <div className="flex flex-row space-x-4">
                  <div className="border border-1 rounded-2xl text-semibold p-4">
                    Walmart Gift Cards Total Value
                  </div>
                  <div className="border border-1 rounded-2xl text-semibold p-4">
                    $856
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}
