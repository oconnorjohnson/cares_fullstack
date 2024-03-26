import SideNavBar from "@/components/user/dashboard/side-nav";
import GetRequests from "@/components/user/tables/requests/page";
import { auth } from "@clerk/nextjs";
export default function RequestsPage() {
  const { userId } = auth();
  console.log(userId);
  if (!userId) {
    return <div>User not authenticated!</div>;
  } else {
    return (
      <div className="flex flex-row">
        <SideNavBar />
        <div className="flex border-t flex-col w-5/6">
          <div className="p-8">
            <GetRequests userId={userId} />
          </div>
        </div>
      </div>
    );
  }
}
