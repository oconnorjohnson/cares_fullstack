import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ClockIcon, CheckSquare2Icon, XSquareIcon } from "lucide-react";
import RequestsByAgencyChart from "@/components/admin/dashboard/request-agency-chart";

export function PendingCard({ pendingRequests }: { pendingRequests: number }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-4xl font-bold flex flex-row justify-between items-center">
          <div>{pendingRequests}</div>
          <ClockIcon className="w-8 h-8" />
        </CardTitle>
      </CardHeader>
      <CardContent className="text-xl">
        {pendingRequests > 1 ? (
          <div>Requests Pending Approval</div>
        ) : (
          <div>Request Pending Approval</div>
        )}
      </CardContent>
    </Card>
  );
}

export function CompletedCard({
  completedRequests,
}: {
  completedRequests: number;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-4xl font-bold flex flex-row justify-between items-center">
          <div>{completedRequests}</div>
          <CheckSquare2Icon className="h-8 w-8" />
        </CardTitle>
      </CardHeader>
      <CardContent className="text-xl">
        {completedRequests > 1 ? (
          <div>Requests Completed & Closed</div>
        ) : (
          <div>Request Completed & Closed</div>
        )}
      </CardContent>
    </Card>
  );
}

export function DeniedCard({ deniedRequests }: { deniedRequests: number }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-4xl font-bold flex flex-row justify-between items-center">
          <div>{deniedRequests}</div>
          <XSquareIcon className="h-8 w-8" />
        </CardTitle>
      </CardHeader>
      <CardContent className="text-xl">
        {deniedRequests > 1 ? (
          <div>Requests Denied</div>
        ) : (
          <div>Request Denied</div>
        )}
      </CardContent>
    </Card>
  );
}

export function RequestsTimeGraph({
  AgencyData,
}: {
  AgencyData: { agencyName: string | null; requestCount: number }[];
}) {
  return (
    <>
      <Card>
        <CardHeader className="text-xl">
          <CardTitle className="text-4xl font-bold pb-12">
            Requests By Agency
          </CardTitle>
        </CardHeader>
        <CardContent>
          <RequestsByAgencyChart AgencyData={AgencyData} />
        </CardContent>
      </Card>
    </>
  );
}
