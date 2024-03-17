import { auth } from "@clerk/nextjs";
import FundsTable from "@/components/admin/tables/funds/page";
import SideNavBar from "@/components/admin/dashboard/side-nav";
import {
  CaresBalanceCard,
  RFFBalanceCard,
} from "@/components/admin/finances/balance-cards";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const runtime = "edge";

const CaresBalanceData = {
  TotalBalance: 1000.87,
  AvailableBalance: 950.33,
};

const RFFBalanceData = {
  TotalBalance: 27000.45,
  AvailableBalance: 2562.35,
};

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
            <div className="text-4xl font-bold py-8">Finances</div>
            <div className="flex flex-row w-full">
              <div className="w-1/3 ml-4">
                <CaresBalanceCard
                  AvailableBalance={CaresBalanceData.AvailableBalance}
                  TotalBalance={CaresBalanceData.TotalBalance}
                />
                <div className="py-2" />
                <RFFBalanceCard
                  AvailableBalance={RFFBalanceData.AvailableBalance}
                  TotalBalance={RFFBalanceData.TotalBalance}
                />
              </div>
              <div className=" w-2/3 mx-4">
                <Card className="flex flex-col h-full">
                  <CardHeader>
                    <CardTitle>Transactions</CardTitle>
                  </CardHeader>
                  <CardFooter>
                    <FundsTable />
                  </CardFooter>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}
