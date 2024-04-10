import SideNavBar from "@/components/admin/dashboard/side-nav";
import {
  getTomorrowsEventsAndFunds,
  getTodaysEventsAndFunds,
} from "@/server/actions/request/actions";
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
  const tomorrowEvents = await getTomorrowsEventsAndFunds();
  const todayEvents = await getTodaysEventsAndFunds();
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
                  {todayEvents.map((event, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                      <AccordionTrigger>{`Event ${index + 1}`}</AccordionTrigger>
                      <AccordionContent>
                        {/* Customize this part with the actual event details you want to display */}
                        <div>User: {event.UserId}</div>
                        <div>Pickup Date: {event.pickup_date}</div>
                        <div>Request ID: {event.RequestId}</div>
                        {/* Add more event details here */}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
                <CardFooter></CardFooter>
              </CardContent>
            </Card>
          </div>
          <div className="w-full px-8 pb-8 ">
            <Card className="w-full">
              <CardContent>
                <CardHeader>
                  <CardTitle>Tomorrow</CardTitle>
                  <CardDescription>
                    Pick-ups scheduled for tomorrow.
                  </CardDescription>
                </CardHeader>
                <Accordion type="single" collapsible className="w-full">
                  {tomorrowEvents.map((event, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                      <AccordionTrigger>{`Event ${index + 1}`}</AccordionTrigger>
                      <AccordionContent>
                        {/* Customize this part with the actual event details you want to display */}
                        <div>User: {event.UserId}</div>
                        <div>Pickup Date: {event.pickup_date}</div>
                        <div>Request ID: {event.RequestId}</div>
                        {/* Add more event details here */}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
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
