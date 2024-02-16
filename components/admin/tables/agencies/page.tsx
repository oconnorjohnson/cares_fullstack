import { Agency, columns } from "@/components/admin/tables/agencies/columns";
import { DataTable } from "@/components/ui/data-table";
import { requestAllAgencies } from "@/server/actions/request/actions";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { DeleteAgency } from "@/server/actions/delete/actions";

async function getAgencies(): Promise<Agency[]> {
  const agencies = await requestAllAgencies();
  const modifiedAgencies = agencies.map((agency) => ({
    ...agency,
    name: agency.name,
  }));
  return modifiedAgencies;
}

async function deleteAgency(agencyId: number) {
  await DeleteAgency(agencyId);
}

export default async function AgenciesTable() {
  const agencies = await getAgencies();
  return (
    <div className="container mx-auto">
      <DataTable
        columns={columns}
        data={agencies}
        defaultSorting={[{ id: "name", desc: true }]}
        searchColumn="name"
        searchPlaceholder="Filter agencies..."
      />
    </div>
  );
}
