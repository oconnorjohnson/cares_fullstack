import SideNavBar from "@/components/user/dashboard/side-nav";
import { Button } from "@/components/ui/button";
import { currentUser } from "@clerk/nextjs";
import ClientsTable from "@/components/user/tables/clients/page";
export default async function ClientsPage() {
  const user = await currentUser();
  const firstName = user?.firstName;
  const email = user?.emailAddresses[0].emailAddress;
  const userId = user?.id;
  console.log(firstName, email);
  if (userId) {
    return (
      <div className="flex flex-row">
        <SideNavBar />
        <div className="flex border-t flex-col w-5/6">
          <div className="w-full p-8">
            <ClientsTable userId={userId} />
          </div>

          <div className="py-12" />
        </div>
      </div>
    );
  }
}
