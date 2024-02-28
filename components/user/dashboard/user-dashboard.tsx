import { auth } from "@clerk/nextjs";
import NewClient from "@/components/forms/new-client";
import NewRequest from "@/components/forms/new-request";
import SideNavBar from "@/components/user/dashboard/side-nav";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import {
  CountOpenRequestsByUserId,
  CountApprovedRequestsByUserId,
  CountDeniedRequestsByUserId,
  CountClientsByUserId,
} from "@/server/actions/count/actions";

import {
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowRightIcon,
} from "lucide-react";

async function fetchCounts(userId: string) {
  const clientCount = await CountClientsByUserId(userId);
  const openRequests = await CountOpenRequestsByUserId(userId);
  const approvedRequests = await CountApprovedRequestsByUserId(userId);
  const deniedRequests = await CountDeniedRequestsByUserId(userId);
  return { openRequests, approvedRequests, deniedRequests, clientCount };
}
export default async function Dashboard() {
  const { userId } = auth();

  console.log(userId);
  if (!userId) {
    return <div>User not authenticated!</div>;
  } else {
    const { openRequests, approvedRequests, deniedRequests, clientCount } =
      await fetchCounts(userId);
    return (
      <>
        <div className="flex flex-row">
          <SideNavBar />
          <div className="flex flex-col border-t w-5/6">
            <div className="text-3xl font-bold pl-12 pt-12">My Dashboard</div>
            <div className="flex flex-col space-y-8 px-12 pt-6">
              <div className="flex space-x-8">
                <div className="flex flex-col w-1/2 flex-grow">
                  {clientCount > 0 ? (
                    <NewRequest userId={userId} />
                  ) : (
                    <div className="flex flex-row items-center justify-center space-x-4 text-xl font-bold">
                      <div>Add a client to get started</div>
                      <ArrowRightIcon className="h-4 w-4" />
                    </div>
                  )}
                </div>
                <div className="flex flex-col w-1/2 flex-grow">
                  <NewClient userId={userId} />
                </div>
              </div>
              <div className="flex space-x-8">
                <div className="flex flex-col flex-grow">
                  <Card className="">
                    <CardHeader>
                      <CardTitle>Pending Requests</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-row justify-start space-x-4 items-center">
                      <ClockIcon />
                      <div className="text-4xl font-black">{openRequests}</div>
                    </CardContent>
                  </Card>
                </div>
                <div className="flex flex-col flex-grow">
                  <Card className="">
                    <CardHeader>
                      <CardTitle>Approved Requests</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-row justify-start space-x-4 items-center">
                      <CheckCircleIcon />
                      <div className="text-4xl font-black">
                        {approvedRequests}
                      </div>
                    </CardContent>
                  </Card>
                </div>
                <div className="flex flex-col flex-grow">
                  <Card className="">
                    <CardHeader>
                      <CardTitle>Denied Requests</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-row justify-start space-x-4 items-center">
                      <XCircleIcon />
                      <div className="text-4xl font-black">
                        {deniedRequests}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}
