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

export default async function AdminOverview() {
  const pendingRequests = (await CountRequestsPendingApproval()) ?? 0;
  const completedRequests = (await CountRequestsCompleted()) ?? 0;
  const deniedRequests = (await CountRequestsDenied()) ?? 0;
  const agencyDataWithNames = (await CountRequestsByAgency()) ?? 0;

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
