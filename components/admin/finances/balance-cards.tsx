"use client";
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
import { trpc } from "@/app/_trpc/client";
import { PlusCircleIcon } from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import LearnMore from "@/components/admin/finances/learn-more";
type BalanceData = {
  TotalBalance: number;
  AvailableBalance: number;
  Version: number;
  ReservedBalance: number;
};

export function LearnMoreCard() {
  return (
    <Card className="w-full h-full">
      <CardHeader className="flex flex-row justify-between space-x-4">
        <CardTitle>Learn More</CardTitle>
        <LearnMore />
      </CardHeader>
      <CardContent>
        <div>
          Transactions are any movement of money in or out of either the CARES
          General Fund or the RFF Grant. Total Balances are the sum of all
          transactions in a given period. Available Balances are the sum of all
          transactions that have not yet been paid out.
        </div>
      </CardContent>
      <CardFooter>
        {/* <Button variant="default">Withdraw</Button> */}
      </CardFooter>
    </Card>
  );
}

export function CaresBalanceCard() {
  const user = useAuth();
  const userId = user?.userId;
  const trpcContext = trpc.useUtils();
  const { data: OperatingBalance, isLoading: isLoadingOperatingBalance } =
    trpc.getOperatingBalance.useQuery();

  if (isLoadingOperatingBalance) {
    return (
      <Card className="w-full h-full">
        <CardHeader className="flex flex-row justify-between space-x-4">
          <CardTitle>CARES Fund</CardTitle>
          <Button variant="outline" disabled>
            Deposit
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex flex-row items-center justify-between border border-1 my-2 px-4 py-2 rounded-xl">
            <div>Total Balance:</div>
            <div className="text-md font-regular ">Loading...</div>
          </div>
          <div className="flex flex-row items-center justify-between border border-1 my-2 px-4 py-2 rounded-xl">
            <div>Reserved Balance:</div>
            <div className="text-md font-regular ">Loading...</div>
          </div>
          <div className="flex flex-row items-center justify-between border border-1 my-2 px-4 py-2 rounded-xl">
            <div>Available Balance:</div>
            <div className="text-md font-regular ">Loading...</div>
          </div>
        </CardContent>
        <CardFooter>
          {/* <Button variant="default">Withdraw</Button> */}
        </CardFooter>
      </Card>
    );
  }
  if (!OperatingBalance) {
    return <div>No data found</div>;
  }
  if (!userId) {
    return <div>Not authenticated</div>;
  } else {
    return (
      <Card className="w-full h-full">
        <CardHeader className="flex flex-row justify-between space-x-4">
          <CardTitle>CARES Fund</CardTitle>
          <CARESDepositButton
            version={OperatingBalance[0].version}
            userId={userId}
          />
        </CardHeader>
        <CardContent>
          <div className="flex flex-row items-center justify-between border border-1 my-2 px-4 py-2 rounded-xl">
            <div>Total Balance:</div>
            <div className="text-lg font-bold">
              ${OperatingBalance[0].totalBalance}
            </div>
          </div>
          <div className="flex flex-row items-center justify-between border border-1 my-2 px-4 py-2 rounded-xl">
            <div>Reserved Balance:</div>
            <div className="text-lg font-bold ">
              ${OperatingBalance[0].reservedBalance}
            </div>
          </div>
          <div className="flex flex-row items-center justify-between border border-1 my-2 px-4 py-2 rounded-xl">
            <div>Available Balance:</div>
            <div className="text-lg font-bold ">
              ${OperatingBalance[0].availableBalance}
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

export function RFFBalanceCard() {
  const user = useAuth();
  const userId = user?.userId;
  const trpcContext = trpc.useUtils();
  const { data: RFFBalance, isLoading: isLoadingRFFBalance } =
    trpc.getRFFBalance.useQuery();
  if (isLoadingRFFBalance) {
    return (
      <Card className="w-full h-full">
        <CardHeader className="flex flex-row justify-between space-x-4">
          <CardTitle>RFF Fund</CardTitle>
          <Button variant="outline" disabled>
            Deposit
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex flex-row items-center justify-between border border-1 my-2 px-4 py-2 rounded-xl">
            <div>Total Balance:</div>
            <div className="text-md font-bold">Loading...</div>
          </div>
          <div className="flex flex-row items-center justify-between border border-1 my-2 px-4 py-2 rounded-xl">
            <div>Reserved Balance:</div>
            <div className="text-md font-regular ">Loading...</div>
          </div>
          <div className="flex flex-row items-center justify-between border border-1 my-2 px-4 py-2 rounded-xl">
            <div>Available Balance:</div>
            <div className="text-md font-regular ">Loading...</div>
          </div>
        </CardContent>
        <CardFooter>
          {/* <Button variant="default">Withdraw</Button> */}
        </CardFooter>
      </Card>
    );
  }
  if (!RFFBalance) {
    return <div>No data found</div>;
  }
  if (!userId) {
    return <div>Not authenticated</div>;
  } else {
    return (
      <Card className="w-full h-full">
        <CardHeader className="flex flex-row justify-between space-x-4">
          <CardTitle>RFF Fund</CardTitle>
          <RFFDepositButton version={RFFBalance[0].version} userId={userId} />
        </CardHeader>
        <CardContent>
          <div className="flex flex-row items-center justify-between border border-1 my-2 px-4 py-2 rounded-xl">
            <div>Total Balance:</div>
            <div className="text-lg font-bold">
              ${RFFBalance[0].totalBalance}
            </div>
          </div>
          <div className="flex flex-row items-center justify-between border border-1 my-2 px-4 py-2 rounded-xl">
            <div>Reserved Balance:</div>
            <div className="text-lg font-bold ">
              ${RFFBalance[0].reservedBalance}
            </div>
          </div>
          <div className="flex flex-row items-center justify-between border border-1 my-2 px-4 py-2 rounded-xl">
            <div>Available Balance:</div>
            <div className="text-lg font-bold ">
              ${RFFBalance[0].availableBalance}
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
