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
import LearnMore from "@/components/admin/finances/learn-more";
import {
  readOperatingBalance,
  readRFFBalance,
} from "@/server/actions/request/actions";

export const runtime = "edge";

const OperatingBalance = await readOperatingBalance();
const RFFBalance = await readRFFBalance();

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
            <div className="flex flex-row w-full">
              <div className="w-1/3 ml-4 pt-8">
                <CaresBalanceCard
                  AvailableBalance={OperatingBalance[0].availableBalance}
                  TotalBalance={OperatingBalance[0].totalBalance}
                  Version={OperatingBalance[0].version}
                />
                <div className="py-2" />
                <RFFBalanceCard
                  AvailableBalance={RFFBalance[0].availableBalance}
                  TotalBalance={RFFBalance[0].totalBalance}
                  Version={RFFBalance[0].version}
                />
              </div>
              <div className=" w-2/3 mx-4 pt-8">
                <Card className="flex flex-col h-full">
                  <CardHeader className="flex flex-row justify-between space-x-4">
                    <CardTitle>Transactions</CardTitle>
                    <LearnMore />
                  </CardHeader>
                  <CardFooter>{/* <FundsTable /> */}</CardFooter>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}
