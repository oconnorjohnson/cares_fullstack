// server component where we'll fetch data and render our table
import { Request, columns } from "@/components/admin/tables/requests/columns";
import { DataTable } from "@/components/ui/data-table";
import { requestAllRequests } from "@/server/actions/request/actions";

async function getRequests(): Promise<Request[]> {
  const requests = await requestAllRequests();
  return requests as Request[];
}

export default async function DemoPage() {
  const requests = await getRequests();

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={requests} />
    </div>
  );
}
