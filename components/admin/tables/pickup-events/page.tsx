import Link from "next/link";
import {
  PickupEvent,
  columns,
} from "@/components/admin/tables/pickup-events/columns";
import { DataTable } from "@/components/ui/data-table";
import { getAllFuturePickupEvents } from "@/server/supabase/functions/read";
import { format } from "date-fns";
import { Card, CardHeader } from "@/components/ui/card";

async function getPickupEvents(): Promise<PickupEvent[]> {
  const pickupEvents = await getAllFuturePickupEvents();
  console.log(pickupEvents);
  const modifiedPickupEvents = pickupEvents.map((pickupEvent) => ({
    ...pickupEvent,
    id: pickupEvent.id,
    created_at: format(new Date(pickupEvent.created_at), "MM/dd/yyyy hh:mm a"), // Adjust the format string as needed
    pickup_date: format(new Date(pickupEvent.pickup_date), "MM/dd/yyyy"),
    UserId: pickupEvent.UserId,
    RequestId: pickupEvent.RequestId,
  }));
  return modifiedPickupEvents as unknown as PickupEvent[];
}

export default async function PickupEventsTable() {
  const pickupEvents = await getPickupEvents();
  return (
    <div className="container mx-auto">
      <Card className="p-8">
        <CardHeader className="text-center text-3xl font-bold">
          All Pickup Events
        </CardHeader>
        <DataTable
          columns={columns}
          data={pickupEvents}
          defaultSorting={[
            {
              id: "pickup_date",
              desc: true,
            },
          ]}
          searchPlaceholder="Search pickup events..."
        />
      </Card>
    </div>
  );
}
