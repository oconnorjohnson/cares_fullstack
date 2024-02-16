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
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";

import { ClockIcon, CheckCircleIcon, XCircleIcon } from "lucide-react";
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
            <div className="text-3xl font-bold pl-12 pt-12">My Dashboard</div>
            <div className="flex flex-grow space-x-8 px-12 pt-6">
              <div className="flex flex-col flex-grow flex-grow">
                <Card>
                  <CardHeader>
                    <CardTitle>Open Requests</CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-row justify-start space-x-4 items-center">
                    <ClockIcon />
                    <div className="text-4xl font-black">45</div>
                  </CardContent>
                </Card>
              </div>
              <div className="flex flex-col flex-grow">
                <Card>
                  <CardHeader>
                    <CardTitle>Approved Requests</CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-row justify-start space-x-4 items-center">
                    <CheckCircleIcon />
                    <div className="text-4xl font-black">12</div>
                  </CardContent>
                </Card>
              </div>
              <div className="flex flex-col flex-grow">
                <Card>
                  <CardHeader>
                    <CardTitle>Denied Requests</CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-row justify-start space-x-4 items-center">
                    <XCircleIcon />
                    <div className="text-4xl font-black">2</div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}
