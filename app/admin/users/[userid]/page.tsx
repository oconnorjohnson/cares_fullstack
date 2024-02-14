import { auth } from "@clerk/nextjs";
const UserDetails = async ({ userId }: { userId: string }) => {
  return (
    <>
      <div>Hello, user # {userId}</div>
    </>
  );
};

export default function UserPage({ params }: { params: { userid: string } }) {
  const { sessionClaims } = auth();
  const isAdmin = (sessionClaims?.publicMetadata as any)?.admin;
  return (
    <>
      {isAdmin ? (
        <UserDetails userId={params.userid} />
      ) : (
        <div>Not allowed!</div>
      )}
    </>
  );
}
