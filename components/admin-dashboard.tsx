import GetFundTypes from "@/components/get-fundTypes";
import { auth } from "@clerk/nextjs";
import CurrentUser from "@/components/current-user";
import NewFundType from "@/components/forms/new-fund-type";

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

          <div className="flex flex-col w-1/4 py-12">
            <NewFundType userId={userId} />
            <div className="py-4" />
            <GetFundTypes />
          </div>
        </div>
      </>
    );
  }
}
