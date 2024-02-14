import { Button } from "@/components/ui/button";
import {
  PendingCard,
  CompletedCard,
  ActiveUsersCard,
  RequestsTimeGraph,
} from "@/components/admin/dashboard/cards";

export default function () {
  return (
    <>
      <div className="grid grid-cols-3 py-10 w-full gap-10 px-10">
        <PendingCard />
        <CompletedCard />
        <ActiveUsersCard />
      </div>
      <div className="flex flex-col pb-10 w-full px-10">
        <RequestsTimeGraph />
      </div>
    </>
  );
}
