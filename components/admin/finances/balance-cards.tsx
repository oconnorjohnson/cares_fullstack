import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  RFFDepositDialog as RFFDepositButton,
  CARESDepositDialog as CARESDepositButton,
} from "@/components/admin/finances/deposit-dialogs";
import { PlusCircleIcon } from "lucide-react";
import { auth } from "@clerk/nextjs";
type BalanceData = {
  TotalBalance: number;
  AvailableBalance: number;
  Version: number;
};

export function CaresBalanceCard(CaresBalanceData: BalanceData) {
  const { userId } = auth();
  if (!userId) {
    return <div>Not authenticated</div>;
  } else {
    return (
      <Card className="w-[400px]">
        <CardHeader className="flex flex-row justify-between space-x-4">
          <CardTitle>Cares Balances</CardTitle>
          <CARESDepositButton
            version={CaresBalanceData.Version}
            userId={userId}
          />
        </CardHeader>
        <CardContent>
          <div className="flex flex-row items-center justify-between border border-1 my-2 px-4 py-2 rounded-xl">
            <div>Total Balance:</div>
            <div className="text-lg font-bold">
              ${CaresBalanceData.TotalBalance}
            </div>
          </div>
          <div className="flex flex-row items-center justify-between border border-1 my-2 px-4 py-2 rounded-xl">
            <div>Available Balance:</div>
            <div className="text-lg font-bold ">
              ${CaresBalanceData.AvailableBalance}
            </div>
          </div>
        </CardContent>
        <CardFooter>
          {/* <Button variant="default">Withdraw</Button> */}
        </CardFooter>
      </Card>
    );
  }
}

export function RFFBalanceCard(RFFBalanceData: BalanceData) {
  const { userId } = auth();
  if (!userId) {
    return <div>Not authenticated</div>;
  } else {
    return (
      <Card className="w-[400px]">
        <CardHeader className="flex flex-row justify-between space-x-4">
          <CardTitle>RFF Balances</CardTitle>
          <RFFDepositButton version={RFFBalanceData.Version} userId={userId} />
        </CardHeader>
        <CardContent>
          <div className="flex flex-row items-center justify-between border border-1 my-2 px-4 py-2 rounded-xl">
            <div>Total Balance:</div>
            <div className="text-lg font-bold ">
              ${RFFBalanceData.TotalBalance}
            </div>
          </div>
          <div className="flex flex-row items-center justify-between border border-1 my-2 px-4 py-2 rounded-xl">
            <div>Available Balance:</div>
            <div className="text-lg font-bold ">
              ${RFFBalanceData.AvailableBalance}
            </div>
          </div>
        </CardContent>
        <CardFooter>
          {/* <Button variant="default">Withdraw</Button> */}
        </CardFooter>
      </Card>
    );
  }
}
