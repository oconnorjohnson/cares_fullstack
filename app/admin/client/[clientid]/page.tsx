import { auth } from "@clerk/nextjs";
const ClientDetails = async ({ clientId }: { clientId: string }) => {
  return (
    <>
      <div>Hello, client # {clientId}</div>
    </>
  );
};

export default function ClientPage({
  params,
}: {
  params: { clientid: string };
}) {
  const { sessionClaims } = auth();
  const isAdmin = (sessionClaims?.publicMetadata as any)?.admin;
  return (
    <>
      {isAdmin ? (
        <ClientDetails clientId={params.clientid} />
      ) : (
        <div>Not Allowed!</div>
      )}
    </>
  );
}
