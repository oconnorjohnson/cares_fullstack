// server component where we'll fetch data and render our table
import { Request, columns } from "@/components/admin/tables/requests/columns";
import { DataTable } from "@/components/ui/data-table";
import { requestAllRequests } from "@/server/actions/request/actions";
import { format } from "date-fns";

async function getRequests(): Promise<Request[]> {
  const requests = await requestAllRequests();
  const modifiedRequests = requests.map((request) => ({
    ...request,
    id: request.id,
    user: request.user
      ? `${request.user.first_name} ${request.user.last_name}`
      : "N/A",
    agency: request.agency ? request.agency.name : "N/A",
    client: request.client
      ? `${request.client.first_name} ${request.client.last_name}`
      : "N/A",
    createdAt: format(new Date(request.createdAt), "PPpp"), // Adjust the format string as needed
    // Convert boolean fields to readable strings (if necessary)
    pendingApproval: request.pendingApproval ? "True" : "False",
    approved: request.approved ? "True" : "False",
    pendingPayout: request.pendingPayout ? "True" : "False",
    paid: request.paid ? "True" : "False",
    hasPreScreen: request.hasPreScreen ? "Complete" : "Incomplete",
    hasPostScreen: request.hasPostScreen ? "Complete" : "Incomplete",
  }));
  console.log(modifiedRequests);
  return modifiedRequests as unknown as Request[];
}

export default async function DemoPage() {
  const requests = await getRequests();

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={requests} />
    </div>
  );
}
