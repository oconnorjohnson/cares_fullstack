import SideNavBar from "@/components/admin/dashboard/side-nav";
import {
  getTomorrowsEventsAndFunds,
  getTodaysEventsAndFunds,
} from "@/server/actions/request/actions";
import Link from "next/link";
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
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowRightIcon } from "lucide-react";
import PickupEventsTable from "@/components/admin/tables/pickup-events/page";
import MarkPaidButton from "@/components/admin/request/mark-paid";

export default async function PickUps() {
  const tomorrowEvents = await getTomorrowsEventsAndFunds();
  const todayEvents = await getTodaysEventsAndFunds();
  return (
    <>
      <div className="flex flex-row">
        <SideNavBar />
        <div className="flex border-t flex-col w-5/6 items-center pb-8">
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
                      <AccordionTrigger>{`${event.user.first_name} ${event.user.last_name}`}</AccordionTrigger>
                      <AccordionContent>
                        <Link href={`mailto:${event.user.email}`}>
                          <div className="underline text-green-600">
                            {event.user.email}
                          </div>
                        </Link>
                        <div>{event.pickup_date}</div>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="w-[200px]">
                                Fund Type
                              </TableHead>
                              <TableHead>Amount</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {event.funds.map((fund) => {
                              const assetMap: { [key: number]: string } = {
                                1: "Walmart Gift Card",
                                2: "Arco Gift Card",
                                3: "Bus Pass",
                                4: "Cash",
                                5: "Invoice",
                                6: "Check",
                              };
                              const assetName =
                                assetMap[
                                  fund.fundTypeId as keyof typeof assetMap
                                ] || "Unknown Asset";
                              return (
                                <TableRow key={fund.id}>
                                  <TableCell className="font-medium">
                                    {assetName}
                                  </TableCell>
                                  <TableCell className="font-medium">
                                    {fund.amount}
                                  </TableCell>
                                </TableRow>
                              );
                            })}
                          </TableBody>
                        </Table>
                        <div className="flex flex-row w-full justify-between pt-8">
                          <MarkPaidButton
                            requestId={event.RequestId}
                            UserId={event.UserId}
                          />
                          <Link href={`/admin/requests/${event.RequestId}`}>
                            <Button>
                              View Request{" "}
                              <ArrowRightIcon className="h-4 w-4" />
                            </Button>
                          </Link>
                        </div>
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
                      <AccordionTrigger>{`${event.user.first_name} ${event.user.last_name}`}</AccordionTrigger>
                      <AccordionContent>
                        <Link href={`mailto:${event.user.email}`}>
                          <div className="underline text-green-600">
                            {event.user.email}
                          </div>
                        </Link>
                        <div>{event.pickup_date}</div>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="w-[200px]">
                                Fund Type
                              </TableHead>
                              <TableHead>Amount</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {event.funds.map((fund) => {
                              const assetMap: { [key: number]: string } = {
                                1: "Walmart Gift Card",
                                2: "Arco Gift Card",
                                3: "Bus Pass",
                                4: "Cash",
                                5: "Invoice",
                                6: "Check",
                              };
                              const assetName =
                                assetMap[
                                  fund.fundTypeId as keyof typeof assetMap
                                ] || "Unknown Asset";
                              return (
                                <TableRow key={fund.id}>
                                  <TableCell className="font-medium">
                                    {assetName}
                                  </TableCell>
                                  <TableCell className="font-medium">
                                    {fund.amount}
                                  </TableCell>
                                </TableRow>
                              );
                            })}
                          </TableBody>
                        </Table>
                        <div className="flex flex-row w-full justify-between pt-8">
                          <MarkPaidButton
                            requestId={event.RequestId}
                            UserId={event.UserId}
                          />
                          <Link href={`/admin/requests/${event.RequestId}`}>
                            <Button>
                              View Request{" "}
                              <ArrowRightIcon className="h-4 w-4" />
                            </Button>
                          </Link>
                        </div>
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
