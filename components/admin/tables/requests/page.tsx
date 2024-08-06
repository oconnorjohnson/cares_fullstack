import { Request, columns } from "@/components/admin/tables/requests/columns";
import { DataTable } from "@/components/ui/data-table";
import {
  fetchAllRequests,
  fetchAllFundTypes,
  fetchAllFunds,
} from "@/server/actions/request/actions";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader } from "@/components/ui/card";
type RequestStatus = "Pending" | "Approved" | "Denied" | "Error";

async function getRequests(): Promise<Request[]> {
  const [requests, fundTypes, funds] = await Promise.all([
    fetchAllRequests(),
    fetchAllFundTypes(),
    fetchAllFunds(),
  ]);

  const fundTypesMap = new Map(fundTypes.map((ft) => [ft.id, ft.typeName]));
  const fundsMap = funds.reduce(
    (acc, fund) => {
      if (!acc[fund.requestId]) acc[fund.requestId] = [];
      acc[fund.requestId].push(fund);
      return acc;
    },
    {} as Record<number, any[]>,
  );

  const modifiedRequests = requests.map((request) => {
    const requestFunds = fundsMap[request.id] || [];
    const formattedFunds = requestFunds.map((fund) => ({
      id: fund.id,
      typeName: fundTypesMap.get(fund.fundTypeId) || "Unknown",
      amount: fund.fundTypeId === 3 ? fund.amount * 2.5 : fund.amount,
    }));

    return {
      ...request,
      id: request.id,
      user: request.User
        ? `${request.User.first_name} ${request.User.last_name?.charAt(0)}.`
        : "N/A",
      agency: request.Agency ? request.Agency.name : "N/A",
      client: request.Client ? `${request.Client.clientID}` : "N/A",
      createdAt: format(new Date(request.created_at), "MMddyyyy"),
      combinedStatus: request.pendingApproval
        ? "Pending"
        : request.approved
          ? "Approved"
          : request.denied
            ? "Denied"
            : "Error",
      pendingPayout: request.pendingPayout ? "True" : "False",
      paid: request.paid ? "Paid" : "False",
      hasPreScreen: request.hasPreScreen ? "Complete" : "Incomplete",
      hasPostScreen: request.hasPostScreen ? "Complete" : "Incomplete",
      isHighlighted: request.pendingApproval,
      funds: formattedFunds,
    };
  });

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

export default async function AdminRequestsTable() {
  const requests = await getRequests();
  const customFilter = {
    label: "Show Pending Pre-Screened Only",
    filterFn: (data: Request[]) =>
      data.filter((request) => request.hasPreScreen && request.pendingApproval),
  };
  return (
    <div className="container mx-auto">
      <Card className="p-8">
        <CardHeader className="text-center text-3xl font-bold">
          All Requests
        </CardHeader>
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
          customFilter={customFilter}
        />
      </Card>
    </div>
  );
}
