import SideNavBar from "@/components/admin/dashboard/side-nav";
import {
  getTomorrowsPickupEvents as getTomorrowEvents,
  getTodaysPickupEvents as getTodayEvents,
} from "@/server/supabase/functions/read";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import PickupEventsTable from "@/components/admin/tables/pickup-events/page";
// we want to get each scheduled pickup mapped into an accordion item, where we also map the related request's id, funds and user's name and email, with a link to the request's [requestid] page
export default async function PickUps() {
  const tomorrowEvents = await getTomorrowEvents();
  const todayEvents = await getTodayEvents();
  return (
    <>
      <div className="flex flex-row">
        <SideNavBar />
        <div className="flex border-t flex-col w-5/6 items-center">
          <div className="w-full px-8 py-8">
            <Card className="w-full">
              <CardContent>
                <CardHeader>
                  <CardTitle>Today</CardTitle>
                  <CardDescription>
                    Pick-ups scheduled for today.
                  </CardDescription>
                </CardHeader>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger>Is it accessible?</AccordionTrigger>
                    <AccordionContent>
                      Yes. It adheres to the WAI-ARIA design pattern.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
                <CardFooter></CardFooter>
              </CardContent>
            </Card>
          </div>
          <PickupEventsTable />
        </div>
      </div>
    </>
  );
}
