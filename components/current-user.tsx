import { currentUser } from "@clerk/nextjs";

export default async function Page() {
  const user = await currentUser();

  return (
    <div className="flex flex-col justify-center align-center">
      <div className="text-2xl pt-1 font-extralight">
        Welcome, {user?.firstName}.
      </div>
    </div>
  );
}
