import SideNavBar from "@/components/admin/dashboard/side-nav";
import {
  getAllFuturePickupEvents as getFutureEvents,
  getTomorrowsPickupEvents as getTomorrowEvents,
  getTodaysPickupEvents as getTodayEvents,
} from "@/server/supabase/functions/read";
export default async function PickUps() {
  const futureEvents = await getFutureEvents();
  const tomorrowEvents = await getTomorrowEvents();
  const todayEvents = await getTodayEvents();
  return (
    <>
      <div className="flex flex-row">
        <SideNavBar />
        <div className="flex border-t flex-col w-5/6 items-center"></div>
      </div>
    </>
  );
}
