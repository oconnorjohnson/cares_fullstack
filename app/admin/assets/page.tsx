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
import CaresAssetCard from "@/components/admin/assets/cares-asset-card";
import RFFAssetCard from "@/components/admin/assets/rff-asset-card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { HelpCircleIcon } from "lucide-react";
import SideNavBar from "@/components/admin/dashboard/side-nav";
import AddBussPass from "@/components/admin/assets/add-bus-pass";
import AddGiftCards from "@/components/admin/assets/add-gift-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
              <div className="flex w-full flex-row align-center border border-1 rounded-xl p-4 space-x-4">
                <AddBussPass />
                <AddGiftCards />
                <Button className="px-5 py-8">
                  <HelpCircleIcon />
                </Button>
              </div>
              <div className="py-4" />
              <div className="flex w-full flex-row justify-between align-center border border-1 rounded-xl p-8 bg-muted">
                <RFFAssetCard />
                <div className="px-4" />
                <CaresAssetCard />
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}
