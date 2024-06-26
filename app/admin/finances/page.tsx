import { auth } from "@clerk/nextjs";
import TransactionsTable from "@/components/admin/tables/transactions/page";
import SideNavBar from "@/components/admin/dashboard/side-nav";
import {
  CaresBalanceCard,
  RFFBalanceCard,
  LearnMoreCard,
} from "@/components/admin/finances/balance-cards";
import { Card, CardContent, CardTitle } from "@/components/ui/card";

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
            <div className="flex flex-row w-full items-center justify-center pt-8 px-8">
              <CaresBalanceCard />
              <div className="px-4" />
              <RFFBalanceCard />
              <div className="px-4" />
              <LearnMoreCard />
            </div>

            <div className=" w-full mx-4 py-8 px-8">
              <Card className="flex flex-col h-full">
                <CardContent>
                  <CardTitle className="pt-8">Transactions</CardTitle>
                  <TransactionsTable />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </>
    );
  }
}
