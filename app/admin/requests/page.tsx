import { auth } from "@clerk/nextjs";
import GetServerRequests from "@/components/admin/tables/requests/page";

export default async function Requests() {
  const { sessionClaims } = auth();
  const isAdmin = (sessionClaims?.publicMetadata as any)?.admin;
  if (!isAdmin) {
    console.log("not admin");
    return <div>Not authenticated</div>;
  } else {
    console.log("admin");
    return (
      <>
        <div className="flex border-t flex-col w-5/6 items-center justify-start">
          <div className="py-4" />
          <GetServerRequests />
        </div>
      </>
    );
  }
}
