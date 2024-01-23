import { currentUser, SignInButton } from "@clerk/nextjs";

export default async function Page() {
  const user = await currentUser();

  if (!user)
    return (
      <div>
        <SignInButton />
      </div>
    );

  return <div>Hello {user?.firstName}</div>;
}
