import {
  FundType,
  columns,
} from "@/components/admin/tables/fund-types/columns";
import { DataTable } from "@/components/ui/data-table";
import { requestAllFundTypes } from "@/server/actions/request/actions";
import { Badge } from "@/components/ui/badge";

async function getFunds(): Promise<FundType[]> {
  const fundTypes = await requestAllFundTypes();
  const modifiedFundTypes = fundTypes.map((fundType) => ({
    ...fundType,
    typeName: fundType.typeName,
  }));
  return modifiedFundTypes;
}

export default async function FundTypesData() {
  const fundTypes = await getFunds();
  return (
    <div className="container mx-auto">
      <DataTable
        columns={columns}
        data={fundTypes}
        defaultSorting={[{ id: "name", desc: true }]}
        searchColumn="typeName"
        searchPlaceholder="Filter fund types"
      />
    </div>
  );
}
