import { currentUser } from "@clerk/nextjs";

export default async function Page() {
  const user = await currentUser();

  if (!user) return <div>Not Logged In</div>;

  return <div>Hello {user?.firstName}</div>;
}
