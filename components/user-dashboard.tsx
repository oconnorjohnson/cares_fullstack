import CurrentUser from "@/components/current-user";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import Uploader from "@/components/example-uploader";

export default function Dashboard() {
  return (
    <>
      <div className="">
        <div className="flex flex-row justify-center">
          <CurrentUser /> You are a user.
        </div>
        <Uploader />
      </div>
    </>
  );
}
