import { auth } from "@clerk/nextjs";
import { FreshPageAlert } from "@/components/shared/alerts";
import SideNavBar from "@/components/admin/dashboard/side-nav";
import DashboardPage from "@/components/admin/dashboard/admin-overview";

export default async function Dashboard() {
  const { userId } = auth();
  if (!userId) {
    return <div>Not authenticated</div>;
  } else {
    return (
      <>
        <div className="flex flex-row">
          <SideNavBar />
          <div className="flex border-t flex-col w-5/6">
            <div className="flex flex-col justify-center w-full">
              <FreshPageAlert />
              <DashboardPage />
            </div>
          </div>
        </div>
      </>
    );
  }
}
