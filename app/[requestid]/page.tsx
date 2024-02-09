import { auth } from "@clerk/nextjs";

const RequestPage = () => {
  return (
    <>
      <div>We'll render the request details in a nice UI here.</div>
    </>
  );
};

export default function RequestDetails({
  params,
}: {
  params: { requestId: number };
}) {
  const { sessionClaims } = auth();
  const isAdmin = (sessionClaims?.publicMetadata as any)?.admin;
  return (
    <>
      <div>{isAdmin ? <RequestPage /> : <div>Not allowed!</div>}</div>
    </>
  );
}
