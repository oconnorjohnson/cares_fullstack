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
      <div className="">
        <div className="flex flex-row justify-center">
          <NewClient userId={userId} />
          <GetClients userId={userId} />
        </div>
        <Uploader />
      </div>
    </>
  );
}
