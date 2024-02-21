import SideNavBar from "@/components/user/dashboard/side-nav";
import GetRequests from "@/components/user/tables/requests/page";
import { auth } from "@clerk/nextjs";
import ReceiptDialog from "@/components/user/receipt-dialog";
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
          <div className="flex flex-row justify-between py-6">
            <ReceiptDialog userId={userId} />
          </div>
          <div className="text-3xl font-bold pl-12">My Requests</div>
          <GetRequests userId={userId} />
        </div>
      </div>
    );
  }
}
