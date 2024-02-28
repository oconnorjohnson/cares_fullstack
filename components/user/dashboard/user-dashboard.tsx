import { auth } from "@clerk/nextjs";
import NewClient from "@/components/forms/new-client";
import NewRequest from "@/components/forms/new-request";
import SideNavBar from "@/components/user/dashboard/side-nav";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import {
  CountOpenRequestsByUserId,
  CountApprovedRequestsByUserId,
  CountDeniedRequestsByUserId,
  CountClientsByUserId,
} from "@/server/actions/count/actions";
import {
  giveUserIdGetRequestsNeedingPreScreen,
  giveUserIdGetRequestsNeedingReceipts,
  giveUserIdGetRequestsNeedingPostScreen,
} from "@/server/actions/request/actions";
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
import {
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowRightIcon,
} from "lucide-react";
import PreScreen from "@/components/forms/pre-screen";
import PostScreen from "@/components/forms/post-screen";
import ReceiptDialog from "@/components/user/receipt-dialog";

async function fetchCounts(userId: string) {
  const clientCount = await CountClientsByUserId(userId);
  const openRequests = await CountOpenRequestsByUserId(userId);
  const approvedRequests = await CountApprovedRequestsByUserId(userId);
  const deniedRequests = await CountDeniedRequestsByUserId(userId);
  return { openRequests, approvedRequests, deniedRequests, clientCount };
}
async function fetchRequestsNeedingPreScreen(userId: string) {
  const requestsNeedPreScreen =
    await giveUserIdGetRequestsNeedingPreScreen(userId);
  return requestsNeedPreScreen;
}
async function fetchRequestsNeedingReceipts(userId: string) {
  const requestsNeedReceipts =
    await giveUserIdGetRequestsNeedingReceipts(userId);
  return requestsNeedReceipts;
}
async function fetchRequestsNeedingPostScreen(userId: string) {
  const RequestsNeedPostScreen =
    await giveUserIdGetRequestsNeedingPostScreen(userId);
  return RequestsNeedPostScreen;
}
export default async function Dashboard() {
  const { userId } = auth();
  if (!userId) {
    return <div>User not authenticated!</div>;
  } else {
    const { openRequests, approvedRequests, deniedRequests, clientCount } =
      await fetchCounts(userId);
    const requestsNeedPreScreen = await fetchRequestsNeedingPreScreen(userId);
    const requestsNeedReceipts = await fetchRequestsNeedingReceipts(userId);
    const requestsNeedPostScreen = await fetchRequestsNeedingPostScreen(userId);
    const countPreScreenRequests = () => requestsNeedPreScreen.length;
    const countReceiptsRequests = () => requestsNeedReceipts.length;
    const countPostScreenRequests = () => requestsNeedPostScreen.length;
    return (
      <>
        <div className="flex flex-row">
          <SideNavBar />
          <div className="flex flex-col border-t w-5/6">
            <div className="text-3xl font-bold pl-12 pt-12">My Dashboard</div>
            <div className="flex flex-col space-y-8 px-12 pt-6">
              <div className="flex space-x-8">
                <div className="flex flex-col w-1/2 flex-grow">
                  {clientCount > 0 ? (
                    <NewRequest userId={userId} />
                  ) : (
                    <div className="flex flex-row items-center justify-center space-x-4 text-xl font-bold">
                      <div>Add a client to get started</div>
                      <ArrowRightIcon className="h-4 w-4" />
                    </div>
                  )}
                </div>
                <div className="flex flex-col w-1/2 flex-grow">
                  <NewClient userId={userId} />
                </div>
              </div>
              <div className="flex space-x-8">
                <div className="flex flex-col flex-grow">
                  <Card className="">
                    <CardHeader>
                      <CardTitle>Pending Requests</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-row justify-start space-x-4 items-center">
                      <ClockIcon />
                      <div className="text-4xl font-black">{openRequests}</div>
                    </CardContent>
                  </Card>
                </div>
                <div className="flex flex-col flex-grow">
                  <Card className="">
                    <CardHeader>
                      <CardTitle>Approved Requests</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-row justify-start space-x-4 items-center">
                      <CheckCircleIcon />
                      <div className="text-4xl font-black">
                        {approvedRequests}
                      </div>
                    </CardContent>
                  </Card>
                </div>
                <div className="flex flex-col flex-grow">
                  <Card className="">
                    <CardHeader>
                      <CardTitle>Denied Requests</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-row justify-start space-x-4 items-center">
                      <XCircleIcon />
                      <div className="text-4xl font-black">
                        {deniedRequests}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
              <div className="flex flex-col flex-grow">
                <Card className="">
                  <CardHeader>
                    <CardTitle>Needs Attention</CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-row justify-start space-x-4 items-center">
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="item-1">
                        <AccordionTrigger>
                          <div className="flex flex-row items-center">
                            Outstanding Pre-Screens
                            <Badge className="ml-2">
                              {countPreScreenRequests()}
                            </Badge>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Client Name</TableHead>
                                <TableHead>Agency Name</TableHead>
                                <TableHead>Submission Date</TableHead>
                                <TableHead>Action</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {requestsNeedPreScreen.map((request) => (
                                <TableRow key={request.id}>
                                  <TableCell>
                                    {request.client.first_name &&
                                      request.client.last_name}
                                  </TableCell>
                                  <TableCell>{request.agency.name}</TableCell>
                                  <TableCell>
                                    {request.createdAt.toDateString()}
                                  </TableCell>
                                  <TableCell>
                                    <PreScreen requestId={request.id} />
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="item-2">
                        <AccordionTrigger>
                          <div className="flex flex-row items-center">
                            Outstanding Receipt Uploads
                            <Badge className="ml-2">
                              {countReceiptsRequests()}
                            </Badge>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Client Name</TableHead>
                                <TableHead>Agency Name</TableHead>
                                <TableHead>Submission Date</TableHead>
                                <TableHead>Action</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {requestsNeedReceipts.map((request) => (
                                <TableRow key={request.id}>
                                  <TableCell>
                                    {request.client.first_name &&
                                      request.client.last_name}
                                  </TableCell>
                                  <TableCell>{request.agency.name}</TableCell>
                                  <TableCell>
                                    {request.createdAt.toDateString()}
                                  </TableCell>
                                  <TableCell>
                                    <ReceiptDialog requestId={request.id} />
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="item-3">
                        <AccordionTrigger>
                          <div className="flex flex-row items-center">
                            Outstanding Post-Screens
                            <Badge className="ml-2">
                              {countPostScreenRequests()}
                            </Badge>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Client Name</TableHead>
                                <TableHead>Agency Name</TableHead>
                                <TableHead>Submission Date</TableHead>
                                <TableHead>Action</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {requestsNeedPostScreen.map((request) => (
                                <TableRow key={request.id}>
                                  <TableCell>
                                    {request.client.first_name &&
                                      request.client.last_name}
                                  </TableCell>
                                  <TableCell>{request.agency.name}</TableCell>
                                  <TableCell>
                                    {request.createdAt.toDateString()}
                                  </TableCell>
                                  <TableCell>
                                    <PostScreen requestId={request.id} />
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}
