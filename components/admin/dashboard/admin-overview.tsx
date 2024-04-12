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
} from "@/server/actions/count/actions";
import PickupScheduler from "@/components/forms/pickup-scheduler";

import NewsUpdater from "@/components/admin/dashboard/news-updater";

export default async function AdminOverview() {
  const pendingRequests = (await CountRequestsPendingApproval()) ?? 0;
  const completedRequests = (await CountRequestsCompleted()) ?? 0;
  const deniedRequests = (await CountRequestsDenied()) ?? 0;
  return (
    <>
      <div className="flex flex-col lg:grid lg:grid-cols-3 py-10 w-full gap-10 px-10">
        <PendingCard pendingRequests={pendingRequests} />
        <CompletedCard completedRequests={completedRequests} />
        <DeniedCard deniedRequests={deniedRequests} />
      </div>
      {/* <PickupScheduler
        userId={"user_2eIOj4WjWzwJJbBusyQYrTUcorF"}
        requestId={39}
      /> */}
      <div className="flex flex-col pb-10 w-full px-10">
        <NewsUpdater />
      </div>
    </>
  );
}
