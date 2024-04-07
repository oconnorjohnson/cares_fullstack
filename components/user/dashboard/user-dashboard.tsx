import { auth } from "@clerk/nextjs";
import NewClient from "@/components/forms/new-client";
import NewRequest from "@/components/forms/new-request";
import SideNavBar from "@/components/user/dashboard/side-nav";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
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
  giveUserIdGetRequestsNeedingAgreements,
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
  DownloadIcon,
} from "lucide-react";
import PreScreen from "@/components/forms/pre-screen";
import PostScreen from "@/components/forms/post-screen";
import AgreementDialog from "@/components/user/agreement-dialog";
import ReceiptDialog from "@/components/user/receipt-dialog";
import {
  getNewsCardOne,
  getNewsCardTwo,
  getNewsCardThree,
} from "@/server/supabase/functions/read";

async function fetchNewsCards() {
  const newsCardOne = await getNewsCardOne();
  const newsCardTwo = await getNewsCardTwo();
  const newsCardThree = await getNewsCardThree();
  return [newsCardOne, newsCardTwo, newsCardThree];
}

async function fetchCounts(userId: string) {
  const clientCount = await CountClientsByUserId(userId);
  const openRequests = await CountOpenRequestsByUserId(userId);
  const approvedRequests = await CountApprovedRequestsByUserId(userId);
  const deniedRequests = await CountDeniedRequestsByUserId(userId);
  return { openRequests, approvedRequests, deniedRequests, clientCount };
}
async function fetchRequestsNeedingPreScreen(userId: string) {
  const response = await giveUserIdGetRequestsNeedingPreScreen(userId);
  // Check if the response contains an error
  if (response.error) {
    console.error(
      "Failed to fetch requests needing pre-screen:",
      response.error,
    );
    return []; // Return an empty array in case of error
  }
  // Ensure the data is treated as an array
  return response.data ?? []; // Use the data if available, otherwise default to an empty array
}
async function fetchRequestsNeedingReceipts(userId: string) {
  try {
    const response = await giveUserIdGetRequestsNeedingReceipts(userId);
    // Check if the response contains an error
    if (response.error) {
      console.error(
        "Failed to fetch requests needing receipts:",
        response.error,
      );
      return []; // Return an empty array in case of error
    }
    return response.data ?? []; // Use the data if available, otherwise default to an empty array
  } catch (error) {
    console.error("Error fetching requests needing receipts:", error);
    return []; // Return an empty array in case of error
  }
}

async function fetchRequestsNeedingPostScreen(userId: string) {
  try {
    const response = await giveUserIdGetRequestsNeedingPostScreen(userId);
    // Check if the response contains an error
    if (response.error) {
      console.error(
        "Failed to fetch requests needing post-screen:",
        response.error,
      );
      return []; // Return an empty array in case of error
    }
    return response.data ?? []; // Use the data if available, otherwise default to an empty array
  } catch (error) {
    console.error("Error fetching requests needing post-screen:", error);
    return []; // Return an empty array in case of error
  }
}

async function fetchRequestsNeedingAgreements(userId: string) {
  try {
    const response = await giveUserIdGetRequestsNeedingAgreements(userId);
    // Check if the response contains an error
    if (response.error) {
      console.error(
        "Failed to fetch requests needing agreements:",
        response.error,
      );
      return []; // Return an empty array in case of error
    }
    return response.data ?? []; // Use the data if available, otherwise default to an empty array
  } catch (error) {
    console.error("Error fetching requests needing agreements:", error);
    return []; // Return an empty array in case of error
  }
}
export default async function Dashboard() {
  const { userId } = auth();
  console.log(userId);
  if (!userId) {
    return <div>User not authenticated!</div>;
  } else {
    const { openRequests, approvedRequests, deniedRequests, clientCount } =
      await fetchCounts(userId);
    const requestsNeedPreScreen = await fetchRequestsNeedingPreScreen(userId);
    const requestsNeedReceipts = await fetchRequestsNeedingReceipts(userId);
    const requestsNeedPostScreen = await fetchRequestsNeedingPostScreen(userId);
    const requestsNeedAgreements = await fetchRequestsNeedingAgreements(userId);
    const [newsCardOne, newsCardTwo, newsCardThree] = await fetchNewsCards();
    const countPreScreenRequests = () => requestsNeedPreScreen.length;
    const countReceiptsRequests = () => requestsNeedReceipts.length;
    const countPostScreenRequests = () => requestsNeedPostScreen.length;
    const countAgreementRequests = () => requestsNeedAgreements.length;

    return (
      <>
        <div className="flex flex-row">
          <SideNavBar />
          <div className="flex flex-col border-t w-5/6">
            <div className="flex flex-col space-y-8 px-12 pt-6">
              <div className="flex space-x-8">
                <div className="flex flex-col justify-center w-1/2 flex-grow">
                  {clientCount! > 0 ? (
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
              <div className="flex space-x-8 h-[400px]">
                <div className="flex flex-col w-1/8 h-full">
                  <Card className="h-full">
                    <CardHeader>
                      <CardTitle>Pending</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-row justify-start space-x-4 items-center">
                      <ClockIcon />
                      <div className="text-4xl font-black">{openRequests}</div>
                    </CardContent>
                    <CardHeader>
                      <CardTitle>Approved</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-row justify-start space-x-4 items-center">
                      <ClockIcon />
                      <div className="text-4xl font-black">
                        {approvedRequests}
                      </div>
                    </CardContent>
                  </Card>
                </div>
                <div className="flex flex-col flex-grow h-full">
                  <Card className="h-full flex flex-row justify-evenly align-center space-x-4 items-center py-8">
                    {/* Update Card #1 */}
                    <Card className="w-[275px] h-full">
                      <CardHeader>
                        <CardTitle>{newsCardOne?.card_title}</CardTitle>
                        <CardDescription>
                          {newsCardOne?.card_description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="text-sm font-light">
                        {newsCardOne?.card_content}
                      </CardContent>
                    </Card>
                    {/* Update Card #2 */}
                    <Card className="w-[275px] h-full">
                      <CardHeader>
                        <CardTitle>{newsCardTwo?.card_title}</CardTitle>
                        <CardDescription>
                          {newsCardTwo?.card_description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="text-sm font-light">
                        {newsCardTwo?.card_content}
                      </CardContent>
                    </Card>
                    {/* Update Card #3 */}
                    <Card className="w-[275px] h-full">
                      <CardHeader>
                        <CardTitle>{newsCardThree?.card_title}</CardTitle>
                        <CardDescription>
                          {newsCardThree?.card_description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="text-sm font-light">
                        {newsCardThree?.card_content}
                      </CardContent>
                    </Card>
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
                                <TableHead>Client</TableHead>
                                <TableHead>Agency</TableHead>
                                <TableHead>Submission Date</TableHead>
                                <TableHead>Action</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {requestsNeedPreScreen.map((request) => (
                                <TableRow key={request.id}>
                                  <TableCell>
                                    {request.clientId
                                      ? `${request.clientId}`
                                      : "'ClientID' not found."}
                                  </TableCell>
                                  <TableCell>{request.agencyId}</TableCell>
                                  <TableCell>{request.created_at}</TableCell>
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
                                <TableHead>Client</TableHead>
                                <TableHead>Agency</TableHead>
                                <TableHead>Submission Date</TableHead>
                                <TableHead>Action</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {requestsNeedReceipts.map((request) => (
                                <TableRow key={request.id}>
                                  <TableCell>
                                    {request.clientId
                                      ? `${request.clientId}`
                                      : "'ClientID' not found."}
                                  </TableCell>
                                  <TableCell>{request.agencyId}</TableCell>
                                  <TableCell>{request.created_at}</TableCell>
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
                                <TableHead>Client</TableHead>
                                <TableHead>Agency</TableHead>
                                <TableHead>Submission Date</TableHead>
                                <TableHead>Action</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {requestsNeedPostScreen.map((request) => (
                                <TableRow key={request.id}>
                                  <TableCell>
                                    {request.clientId
                                      ? `${request.clientId}`
                                      : "'ClientID' not found."}
                                  </TableCell>
                                  <TableCell>{request.agencyId}</TableCell>
                                  <TableCell>{request.created_at}</TableCell>

                                  <TableCell>
                                    <PostScreen requestId={request.id} />
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="item-4">
                        <AccordionTrigger>
                          <div className="flex flex-row items-center">
                            Outstanding Agreement Uploads
                            <Badge className="ml-2">
                              {countAgreementRequests()}
                            </Badge>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Client ID</TableHead>
                                <TableHead>Agency Name</TableHead>
                                <TableHead>Submission Date</TableHead>
                                <TableHead>Action</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {requestsNeedAgreements.map((request) => (
                                <TableRow key={request.id}>
                                  <TableCell>
                                    {request.clientId
                                      ? `${request.clientId}`
                                      : "'ClientID' not found."}
                                  </TableCell>
                                  <TableCell>{request.agencyId}</TableCell>
                                  <TableCell>{request.created_at}</TableCell>

                                  <TableCell>
                                    <AgreementDialog requestId={request.id} />
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
              <div className="flex flex-col flex-grow">
                <Card className="mb-8">
                  <CardHeader>
                    <CardTitle>Resources</CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-row justify-start space-x-4 items-center">
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="item-1">
                        <AccordionTrigger>
                          <div className="flex flex-row items-center">
                            Forms and Agreements
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="flex flex-row justify-start space-x-4 items-center">
                            <Link
                              className="underline"
                              href="https://utfs.io/f/03fe23bf-077f-4df3-8923-0b985814066a-xthtld.pdf"
                            >
                              <Button variant="ghost">
                                Verification of Client&apos;s Receipt of Support
                                <DownloadIcon className="ml-2 h-4 w-4" />
                              </Button>
                            </Link>
                          </div>
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
