// server component where we'll fetch data and render our table
import { Request, columns } from "@/components/admin/tables/requests/columns";
import { DataTable } from "@/components/ui/data-table";
import { requestAllRequests } from "@/server/actions/request/actions";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
type RequestStatus = "Pending" | "Approved" | "Denied" | "Error";
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
    combinedStatus: request.pendingApproval
      ? "Pending"
      : request.approved
        ? "Approved"
        : request.denied
          ? "Denied"
          : "Error",
    pendingPayout: request.pendingPayout ? "True" : "False",
    paid: request.paid ? "True" : "False",
    hasPreScreen: request.hasPreScreen ? "Complete" : "Incomplete",
    hasPostScreen: request.hasPostScreen ? "Complete" : "Incomplete",
    isHighlighted: request.pendingApproval,
  }));
  console.log(modifiedRequests);
  const statusPriority: { [key in RequestStatus]: number } = {
    Pending: 1,
    Approved: 2,
    Denied: 3,
    Error: 4,
  };

  modifiedRequests.sort((a, b) => {
    // Explicitly assert the type of combinedStatus as RequestStatus
    const statusA = a.combinedStatus as RequestStatus;
    const statusB = b.combinedStatus as RequestStatus;

    return statusPriority[statusA] - statusPriority[statusB];
  });
  return modifiedRequests as unknown as Request[];
}

export default async function DemoPage() {
  const requests = await getRequests();

  return (
    <div className="container mx-auto">
      <DataTable
        columns={columns}
        data={requests}
        defaultSorting={[
          {
            id: "pendingApproval",
            desc: true,
          },
        ]}
        searchColumn="client"
        searchPlaceholder="Filter clients..."
      />
    </div>
  );
}
