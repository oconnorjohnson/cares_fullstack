import { currentUser } from "@clerk/nextjs";

export default async function Page() {
  const user = await currentUser();

  return (
    <>
      <div>
        Welcome, {user?.firstName}. Your User ID is: {user?.id}
      </div>
      <div className="px-1" />
    </>
  );
}
