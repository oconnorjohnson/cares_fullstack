import CurrentUser from "@/components/current-user";
import NewClient from "@/components/forms/new-client";
import { serverClient } from "@/app/_trpc/serverClient";

export default async function Dashboard() {
  const todos = await serverClient.getTodos();
  return (
    <>
      <div className="">
        <div className="flex flex-row justify-center">
          <CurrentUser /> You are an admin.
          <NewClient />
        </div>
      </div>
    </>
  );
}
