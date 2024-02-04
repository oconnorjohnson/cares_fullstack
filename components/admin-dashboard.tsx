import GetFundTypes from "@/components/get-fundTypes";
import { auth } from "@clerk/nextjs";
import CurrentUser from "@/components/current-user";
import NewFundType from "@/components/forms/new-fund-type";
import NewAgency from "@/components/forms/new-agency";
import GetAgencies from "@/components/get-agencies";

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
