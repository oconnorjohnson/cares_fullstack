import { Fund, columns } from "@/components/admin/tables/funds/columns";
import { DataTable } from "@/components/ui/data-table";
import { getPaidFunds } from "@/server/actions/request/actions";
import type { FundData } from "@/server/actions/request/actions";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

async function getFunds(): Promise<Fund[]> {
  const funds: Fund[] = await getPaidFunds(); // Ensure getPaidFunds returns Fund[]
  console.log(funds);
  const modifiedFunds = funds.map((fund) => ({
    ...fund,
    requestId: fund.requestId, // TypeScript should recognize this property now
    typeName: fund.FundType.typeName, // And this one
    amount: fund.amount,
  }));
  return modifiedFunds;
}

export default async function FundsTable() {
  const funds = await getFunds();
  return (
    <div className="container mx-auto">
      <DataTable
        columns={columns}
        data={funds}
        defaultSorting={[
          {
            id: "amount",
            desc: true,
          },
        ]}
        searchColumn="typeName"
        searchPlaceholder="Filter fund types..."
      />
    </div>
  );
}
