import { Button } from "@/components/ui/button";
import {
  PendingCard,
  CompletedCard,
  DeniedCard,
  RequestsTimeGraph,
} from "@/components/admin/dashboard/cards";
import {
  CountRequestsPendingApproval,
  CountRequestsCompleted,
  CountRequestsDenied,
  CountRequestsByAgency,
} from "@/server/actions/count/actions";
import { AgencyById } from "@/server/actions/request/actions";

async function getAgencyDataWithNames() {
  const agencyData = await CountRequestsByAgency();
  const agencyDataWithNames = await Promise.all(
    agencyData.map(async ({ agencyId, requestCount }) => {
      const agency = await AgencyById(agencyId); // Assuming AgencyById returns an object with a name property
      return { agencyName: agency ? agency.name : null, requestCount }; // Directly use the string name
    }),
  );
  return agencyDataWithNames;
}

export default async function AdminOverview() {
  const pendingRequests = await CountRequestsPendingApproval();
  const completedRequests = await CountRequestsCompleted();
  const deniedRequests = await CountRequestsDenied();
  const agencyDataWithNames = await getAgencyDataWithNames();

  return (
    <>
      <div className="grid grid-cols-3 py-10 w-full gap-10 px-10">
        <PendingCard pendingRequests={pendingRequests} />
        <CompletedCard completedRequests={completedRequests} />
        <DeniedCard deniedRequests={deniedRequests} />
      </div>
      <div className="flex flex-col pb-10 w-full px-10">
        <RequestsTimeGraph AgencyData={agencyDataWithNames} />
      </div>
    </>
  );
}
