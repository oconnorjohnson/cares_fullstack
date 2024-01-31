import CurrentUser from "@/components/current-user";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import Uploader from "@/components/example-uploader";
import { auth } from "@clerk/nextjs";
import NewClient from "@/components/forms/new-client";
import GetClients from "@/components/get-clients";

export default function Dashboard() {
  const { userId } = auth();
  return (
    <>
      <div className="px-24">
        <div className="flex flex-col justify-center">
          <div className="flex justify-between items-center">
            <NewClient userId={userId} />
          </div>
          <GetClients userId={userId} />
        </div>
        <Uploader />
      </div>
    </>
  );
}
