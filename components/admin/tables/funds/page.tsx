import { Fund, columns } from "@/components/admin/tables/funds/columns";
import { DataTable } from "@/components/ui/data-table";
import { getPaidFunds } from "@/server/actions/request/actions";
import type { FundData } from "@/server/actions/request/actions";
import { format } from "date-fns";
import { Card, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

async function getFunds(): Promise<Fund[]> {
  const funds: Fund[] = await getPaidFunds();
  console.log(funds);
  const modifiedFunds = funds.map((fund) => ({
    ...fund,
    requestId: fund.requestId,
    typeName: fund.FundType.typeName,
    amount: fund.amount,
  }));
  return modifiedFunds as unknown as Fund[];
}

export default async function FundsTable() {
  const funds = await getFunds();
  return (
    <div className="container mx-auto">
      <Card className="p-8">
        <CardHeader className="text-center text-3xl font-bold">
          Processed and Paid Funds
        </CardHeader>
        <DataTable
          columns={columns}
          data={funds}
          defaultSorting={[
            {
              id: "requestId",
              desc: true,
            },
          ]}
          searchColumn="typeName"
          searchPlaceholder="Filter fund types..."
        />
      </Card>
    </div>
  );
}
