import { auth } from "@clerk/nextjs";
import NewClient from "@/components/forms/new-client";
import GetClients from "@/components/get-clients";
import NewRequest from "@/components/forms/new-request";

export default function Dashboard() {
  const { userId } = auth();
  return (
    <>
      <div className="px-24">
        <div className="flex flex-col justify-center">
          <div className="flex flex-row justify-between py-6">
            <NewClient userId={userId} />
            <NewRequest userId={userId} />
          </div>
          <GetClients userId={userId} />
        </div>
      </div>
    </>
  );
}
