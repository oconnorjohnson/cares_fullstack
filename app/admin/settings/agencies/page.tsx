import { auth } from "@clerk/nextjs";
import { Card, CardHeader } from "@/components/ui/card";
import AgencyTypes from "@/components/admin/tables/agencies/page";
import AddAgency from "@/components/forms/new-agency";
import AddFundType from "@/components/forms/new-fund-type";
import SideNavBar from "@/components/admin/dashboard/side-nav";
import SettingsSideNav from "@/components/admin/dashboard/settings-side-nav";

export default async function Requests() {
  const { sessionClaims, userId } = auth();
  const isAdmin = (sessionClaims?.publicMetadata as any)?.admin;
  const user = userId;
  if (!isAdmin || !user) {
    return <div>Not authenticated</div>;
  } else {
    return (
      <div className="flex flex-row">
        <SideNavBar />
        <SettingsSideNav />
        <div className="flex border-t flex-col w-5/6 ">
          <div className="flex flex-col justify-center w-full">
            <div className="flex flex-row items-start justify-center space-x-12 px-10 pt-12">
              <Card className="flex flex-col justify-center text-center space-y-8 p-8">
                <div className="text-4xl font-bold py-8">Agencies</div>
                <AddAgency userId={user} />
                <div className="border-2 rounded-xl w-full">
                  <AgencyTypes />
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
