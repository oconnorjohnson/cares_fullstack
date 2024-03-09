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
    agencyData.map(async ({ agencyId, agencyName, count }) => {
      const agency = await AgencyById(agencyId);
      return { agencyName, count };
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
      <div className="flex flex-col lg:grid lg:grid-cols-3 py-10 w-full gap-10 px-10">
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
