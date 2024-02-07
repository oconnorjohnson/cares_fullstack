import { auth } from "@clerk/nextjs";
import NewClient from "@/components/forms/new-client";
import GetClients from "@/components/user/get-clients";
import NewRequest from "@/components/forms/new-request";
import CurrentUser from "@/components/shared/current-user";
import GetRequests from "@/components/user/get-requests";

export default function Dashboard() {
  const { userId } = auth();
  if (!userId) {
    return <div>User not authenticated!</div>;
  } else {
    return (
      <>
        <div className="m-4">
          <div className="flex flex-col justify-center">
            <div className="flex flex-row justify-between py-6">
              <NewRequest userId={userId} />
              <CurrentUser />
              <NewClient userId={userId} />
            </div>
            <div className="flex flex-row justify-between">
              <div className="flex flex-col justify-start">
                <GetRequests userId={userId} />
              </div>
              <div className="px-2" />
              <div className="flex flex-col justify-start">
                <GetClients userId={userId} />
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}
