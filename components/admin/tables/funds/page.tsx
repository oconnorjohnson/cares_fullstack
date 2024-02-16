import { Fund, columns } from "@/components/admin/tables/funds/columns";
import { DataTable } from "@/components/ui/data-table";
import { getPaidFunds } from "@/server/actions/request/actions";
import type { FundData } from "@/server/actions/request/actions";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

async function getFunds(): Promise<Fund[]> {
  const funds = await getPaidFunds();
  console.log(funds);
  const modifiedFunds = funds.map((fund) => ({
    ...fund,
    requestId: fund.request.id,
    typeName: fund.fundType.typeName,
    amount: fund.amount,
  }));
  return modifiedFunds as unknown as Fund[];
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