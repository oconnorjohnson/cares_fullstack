import { auth } from "@clerk/nextjs";
import FundsTable from "@/components/admin/tables/funds/page";
import SideNavBar from "@/components/admin/dashboard/side-nav";

export default async function Requests() {
  const { sessionClaims } = auth();
  const isAdmin = (sessionClaims?.publicMetadata as any)?.admin;
  if (!isAdmin) {
    return <div>Not authenticated</div>;
  } else {
    return (
      <>
        <div className="flex flex-row">
          <SideNavBar />
          <div className="flex border-t flex-col w-5/6 items-center justify-start">
            <div className="py-4" />
            <FundsTable />
          </div>
        </div>
      </>
    );
  }
}
