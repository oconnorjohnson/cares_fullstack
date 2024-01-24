import CurrentUser from "@/components/current-user";
import { SignedIn, SignedOut } from "@clerk/nextjs";

export default function Dashboard() {
  return (
    <>
      <div className="">
        <div className="flex flex-row justify-center">
          <CurrentUser /> You are an admin.
        </div>
      </div>
    </>
  );
}
