import { Request, columns } from "@/components/user/tables/requests/columns";
import { DataTable } from "@/components/ui/data-table";
import { requestUsersRequests } from "@/server/actions/request/actions";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

type RequestStatus = "Pending" | "Approved" | "Denied" | "Error";

async function getRequests({ userId }: { userId: string }): Promise<Request[]> {
  const requests = await requestUsersRequests(userId as string);
  const modifiedRequests = requests.map((request) => ({
    ...request,
    id: request.id,
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
    hasPreScreen: request.hasPreScreen ? "Complete" : "Incomplete",
    hasPostScreen: request.hasPostScreen ? "Complete" : "Incomplete",
    isHighlighted: request.pendingApproval,
  }));
  const statusPriority: { [key in RequestStatus]: number } = {
    Pending: 1,
    Approved: 2,
    Denied: 3,
    Error: 4,
  };
  modifiedRequests.sort((a, b) => {
    const statusA = a.combinedStatus as RequestStatus;
    const statusB = b.combinedStatus as RequestStatus;
    return statusPriority[statusA] - statusPriority[statusB];
  });
  return modifiedRequests as unknown as Request[];
}

export default async function UserRequests({ userId }: { userId: string }) {
  const requests = await getRequests({ userId });

  return (
    <div className="container mx-auto py-10">
      <DataTable
        columns={columns}
        data={requests}
        defaultSorting={[
          {
            id: "pendingApproval",
            desc: true,
          },
        ]}
      />
    </div>
  );
}
