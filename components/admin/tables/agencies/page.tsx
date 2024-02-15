import { Agency, columns } from "@/components/admin/tables/agencies/columns";
import { DataTable } from "@/components/ui/data-table";
import { requestAllAgencies } from "@/server/actions/request/actions";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

async function getAgencies(): Promise<Agency[]> {
  const agencies = await requestAllAgencies();
  const modifiedAgencies = agencies.map((agency) => ({
    ...agency,
    name: agency.name,
    id: agency.id,
  }));
  return modifiedAgencies;
}

export default async function AgenciesTable() {
  const agencies = await getAgencies();
  return (
    <div className="container mx-auto">
      <DataTable
        columns={columns}
        data={agencies}
        defaultSorting={[{ id: "name", desc: true }]}
      />
    </div>
  );
}
