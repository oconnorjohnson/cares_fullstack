import { auth } from "@clerk/nextjs";
import NewClient from "@/components/forms/new-client";
import GetClients from "@/components/user/get-clients";
import NewRequest from "@/components/forms/new-request";
import CurrentUser from "@/components/shared/current-user";
import GetRequests from "@/components/user/tables/requests/page";

export default function Dashboard() {
  const { userId } = auth();
  console.log(userId);
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
            <div className="text-3xl font-bold">My Requests</div>
            <GetRequests userId={userId} />
          </div>
        </div>
      </>
    );
  }
}
