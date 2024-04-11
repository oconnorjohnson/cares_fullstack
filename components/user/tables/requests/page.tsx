import { Request, columns } from "@/components/user/tables/requests/columns";
import { DataTable } from "@/components/ui/data-table";
import { requestUsersRequests } from "@/server/actions/request/actions";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { getPickupEventByRequestId } from "@/server/supabase/functions/read";

type RequestStatus = "Pending" | "Approved" | "Denied" | "Error";

async function getRequests({ userId }: { userId: string }): Promise<Request[]> {
  const requests = await requestUsersRequests(userId as string);
  const modifiedRequests = requests.map((request) => ({
    ...request,
    id: request.id,
    agency: request.agencyId ? request.Agency?.name : "N/A",
    client: request.clientId ? `${request.Client?.clientID}` : "N/A",
    createdAt: format(new Date(request.created_at), "MM/dd/yyyy"), // Adjust the format string as needed
    // Convert boolean fields to readable strings (if necessary)
    combinedStatus: request.pendingApproval
      ? "Pending"
      : request.approved
        ? "Approved"
        : request.denied
          ? "Denied"
          : "Error",
    hasPreScreen: request.hasPreScreen,
    hasPostScreen: request.hasPostScreen,
    paid: request.paid,
    approved: request.approved,
    denied: request.denied,
    isHighlighted: request.pendingApproval,
    isPickupScheduled: request.isPickupScheduled,
    pickup_date: request.pickup_date,
  }));
  console.log(modifiedRequests);
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
    <>
      <Card>
        <CardHeader>
          <CardTitle>My Requests</CardTitle>
          <CardDescription>
            All of your requests, and their required actions if relevant, are
            listed and updated here.
          </CardDescription>
          <CardContent>
            <div className="container mx-auto">
              <DataTable
                columns={columns}
                data={requests}
                defaultSorting={[
                  {
                    id: "actions",
                    desc: true,
                  },
                ]}
                searchPlaceholder="Search requests"
              />
            </div>
          </CardContent>
        </CardHeader>
      </Card>
    </>
  );
}
