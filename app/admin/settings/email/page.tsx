import GetFundTypes from "@/components/admin/tables/funds/get-fundTypes";
import { auth } from "@clerk/nextjs";
import { Card, CardHeader } from "@/components/ui/card";
import SideNavBar from "@/components/admin/dashboard/side-nav";
import SettingsSideNav from "@/components/admin/dashboard/settings-side-nav";
import AdminEmailPreferences from "@/components/admin/settings/email-preferences";
import { GetAdminEmailPreferenceByUserId } from "@/server/actions/request/actions";

export default async function Requests() {
  const { sessionClaims, userId } = auth();
  const isAdmin = (sessionClaims?.publicMetadata as any)?.admin;
  const user = userId;
  const adminEmailPreference = await GetAdminEmailPreferenceByUserId(user!);
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
              <Card className="flex flex-col justify-center text-center space-y-8">
                <div className="text-4xl font-bold py-8">Email Preferences</div>

                <div className="border-2 p-12 rounded-xl w-full">
                  <AdminEmailPreferences
                    currentPreference={adminEmailPreference}
                  />
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
