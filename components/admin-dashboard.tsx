import NewClient from "@/components/forms/new-client";
import { serverClient } from "@/app/_trpc/serverClient";
import { auth } from "@clerk/nextjs";

export default async function Dashboard() {
  const { userId } = auth();
  const todos = await serverClient.getTodos();
  return (
    <>
      <div className="">
        <div className="flex flex-row justify-center">
          <NewClient userId={userId} />
        </div>
      </div>
    </>
  );
}
