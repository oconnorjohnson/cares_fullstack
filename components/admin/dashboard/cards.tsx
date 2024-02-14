import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import RequestsByAgencyChart from "@/components/admin/dashboard/request-agency-chart";

export function PendingCard({ pendingRequests }: { pendingRequests: number }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{pendingRequests}</CardTitle>
        {pendingRequests > 1 ? (
          <div>Requests Pending Approval</div>
        ) : (
          <div>Request Pending Approval</div>
        )}
      </CardHeader>
      <CardContent></CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">Cancel</Button>
        <Button>Deploy</Button>
      </CardFooter>
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
        <CardTitle>{completedRequests}</CardTitle>
        {completedRequests > 1 ? (
          <div>Requests Completed & Closed</div>
        ) : (
          <div>Request Completed & Closed</div>
        )}
      </CardHeader>
      <CardContent></CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">Cancel</Button>
        <Button>Deploy</Button>
      </CardFooter>
    </Card>
  );
}

export function DeniedCard({ deniedRequests }: { deniedRequests: number }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{deniedRequests}</CardTitle>
        {deniedRequests > 1 ? (
          <div>Requests Denied</div>
        ) : (
          <div>Request Denied</div>
        )}
      </CardHeader>
      <CardContent></CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">Cancel</Button>
        <Button>Deploy</Button>
      </CardFooter>
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
        <CardHeader>
          <CardTitle>Requests By Agency</CardTitle>
          <CardDescription>
            Deploy your new project in one-click.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RequestsByAgencyChart AgencyData={AgencyData} />
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline">Cancel</Button>
          <Button>Deploy</Button>
        </CardFooter>
      </Card>
    </>
  );
}
