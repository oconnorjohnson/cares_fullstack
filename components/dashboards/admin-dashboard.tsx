import GetFundTypes from "@/components/admin/tables/funds/get-fundTypes";
import { auth } from "@clerk/nextjs";
import CurrentUser from "@/components/shared/current-user";
import NewFundType from "@/components/forms/new-fund-type";
import NewAgency from "@/components/forms/new-agency";
import GetAgencies from "@/components/admin/tables/agencies/get-agencies";
import GetFilteredRequests from "@/components/admin/requests-table";
import GetServerRequests from "@/components/admin/tables/requests/page";

export default async function Dashboard() {
  const { userId } = auth();
  if (!userId) {
    return <div>Not authenticated</div>;
  } else {
    return (
      <>
        <div className="flex flex-col items-center justify-center">
          <CurrentUser />

          <div className="text-md font-extralight">
            You are an administrator.
          </div>

          <div className="">
            <GetServerRequests />
          </div>
          <div className="flex py-8">
            <div className="flex flex-col items-center">
              <NewFundType userId={userId} />
              <div className="py-4" />
              <GetFundTypes />
            </div>
            <div className="px-4" />
            <div className="flex flex-col items-center">
              <NewAgency userId={userId} />
              <div className="py-4" />
              <GetAgencies />
            </div>
          </div>
        </div>
      </>
    );
  }
}
