import { auth } from "@clerk/nextjs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { requestRequestByRequestId } from "@/server/actions/request/actions";
import { formatDateWithSuffix } from "@/server/utils";
import { XIcon, CheckIcon, ArrowLeftIcon, ArrowDownIcon } from "lucide-react";
import FundAction from "@/components/admin/fund-actions";
import Link from "next/link";
import DenyButton from "@/components/admin/request/deny";
import ApproveButton from "@/components/admin/request/approve";
import AddFundToRequestById from "@/components/admin/request/add-fund";
import MarkPaidButton from "@/components/admin/request/mark-paid";
import { format } from "date-fns";
import type { RequestData } from "@/server/actions/request/actions";
export const runtime = "edge";

const RequestPage = async ({ requestid }: { requestid: string }) => {
  console.log(requestid);
  // convert page param string to number
  const requestId = Number(requestid);
  // fetch request data from server
  const result = await requestRequestByRequestId(requestId);
  // destructure supabase's array of results into a single object
  if (!Array.isArray(result)) {
    throw new Error("Expected an array");
  }
  // set the request data to the first element of the array
  const [request] = result;
  const SDOHBadges = request.SDOH?.map((SDOH: any, index: number) => (
    <Badge key={index} className="mr-2 mb-2 text-sm">
      {SDOH}
    </Badge>
  ));
  const RFFBadges = request.RFF?.map((RFF: any, index: number) => (
    <Badge key={index} className="mr-2 mb-2 text-sm">
      {RFF}
    </Badge>
  ));
  console.log(request.Fund);
  console.log(request.PreScreenAnswerss);
  const FundsBadges = request.Fund?.map((fund: any, index: number) => (
    <div
      key={index}
      className="flex items-center text-sm justify-end space-x-2 mb-2"
    >
      <Badge className="text-sm">{fund.FundType.typeName}</Badge>
      <div className="px-2" />
      <span className="text-lg font-semibold">${fund.amount}</span>
      <div className="px-2" />
      {fund.Receipt?.url ? (
        <Link
          href={fund.Receipt.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-lg font-semibold underline"
        >
          View Receipt
        </Link>
      ) : (
        <span>No Receipt</span>
      )}
      <div className="px-2" />
      {!request.approved && !request.denied && (
        <FundAction
          fundId={fund.id}
          fundTypeId={fund.FundType.id}
          fundTypeName={fund.FundType.typeName}
          amount={fund.amount}
          requestId={requestId}
        />
      )}
    </div>
  ));

  return (
    <>
      <div className="w-5/6 items-center justify-start">
        <div className="pl-12">
          <Link href="/admin/requests">
            <Button size="icon">
              <ArrowLeftIcon />
            </Button>
          </Link>
        </div>
        <div className="flex flex-col items-center justify-center py-12">
          <Card className="w-2/3">
            <CardHeader>
              <CardTitle className="flex flex-cols-3 justify-between">
                <div className="text-center text-3xl pt-0.5">
                  {request?.User.first_name}&apos;s request from{" "}
                  {request.created_at}
                </div>
                <div className="flex flex-row justify-between px-6">
                  {request.pendingApproval && (
                    <>
                      <DenyButton requestId={requestId} />
                      <div className="px-2" />{" "}
                      {/* This div acts as a spacer between the buttons */}
                      <ApproveButton requestId={requestId} />
                    </>
                  )}
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="border py-4 mx-4 rounded-lg">
              <div className="flex flex-col">
                <div className="flex flex-cols-2 justify-between">
                  <div className="text-xl font-extralight pr-4">User</div>

                  <div className="text-xl font-bold">
                    {request.User.first_name} {request.User.last_name}
                  </div>
                </div>
                <Separator className="my-2" />
                <div className="flex flex-cols-2 justify-between">
                  <div className="text-xl font-extralight pr-4">Client</div>
                  {/* <Link href={`/admin/client/${request.client.id}`}>
                    <div className="text-xl font-bold underline hover:text-zinc-500">
                      {request.client} | {request.client.first_name}{" "}
                      {request.client.last_name}
                    </div>
                  </Link> */}
                </div>
                <Separator className="my-2" />
                <div className="flex flex-cols-2 justify-between">
                  <div className="text-xl font-extralight pr-4">Email</div>
                  <Link href={`mailto:${request.User.EmailAddress.email}`}>
                    {/* <div className="text-xl font-bold underline hover:text-zinc-500">
                      {.fir?.emailAddresses?.[0]?.email ??
                        "Error rendering email"}
                    </div> */}
                  </Link>
                </div>
                <Separator className="my-2" />
                <div className="flex flex-cols-2 justify-between">
                  <div className="text-xl font-extralight pr-4">Agency</div>
                  <div className="text-xl font-bold">{request.Agency.name}</div>
                </div>
                <Separator className="my-2" />
                <div className="flex flex-cols-2 justify-between">
                  <div className="text-xl font-extralight pr-4">
                    Request Status
                  </div>
                  <div className="text-xl font-bold">
                    {request?.pendingApproval ? (
                      <Badge className="bg-yellow-300 text-black text-sm">
                        Pending Approval
                      </Badge>
                    ) : request?.approved ? (
                      <Badge className="bg-green-600 text-sm">Approved</Badge>
                    ) : request?.denied ? (
                      <Badge className="bg-red-600 text-sm">Denied</Badge>
                    ) : (
                      <Badge className="bg-pink-500">
                        Error, this request isn&apos;t pending, approved or
                        denied.
                      </Badge>
                    )}
                  </div>
                </div>
                <Separator className="my-2" />
                <div className="flex flex-cols-2 justify-between">
                  <div className="text-xl font-extralight pr-4">Pre-Screen</div>
                  <div className="text-xl font-bold">
                    {request?.hasPreScreen ? (
                      <Badge className="bg-green-600 text-sm">Completed</Badge>
                    ) : (
                      <Badge className="bg-red-500 text-sm">Not Started</Badge>
                    )}
                  </div>
                </div>
                <Separator className="my-2" />
                <div className="flex flex-cols-2 justify-between">
                  <div className="text-xl font-extralight pr-4">
                    Post-Screen
                  </div>
                  <div className="text-xl font-bold">
                    {request?.hasPostScreen ? (
                      <Badge className="bg-green-600 text-sm">Completed</Badge>
                    ) : (
                      <Badge className="bg-red-500 text-sm">Not Started</Badge>
                    )}
                  </div>
                </div>
                <Separator className="my-2" />
                <div className="flex flex-cols-2 justify-between">
                  <div className="text-xl font-extralight pr-4">
                    Paid Status
                  </div>
                  <div className="text-xl font-bold">
                    {request?.paid ? (
                      <Badge className="bg-green-600 text-white text-sm">
                        Paid
                      </Badge>
                    ) : (
                      <Badge className="bg-yellow-500">
                        Not marked as paid.
                      </Badge>
                    )}
                  </div>
                </div>
                <Separator className="my-2" />
                <div className="flex flex-cols-2 justify-between">
                  <div className="text-xl font-extralight pr-4">
                    Submitted On
                  </div>
                  <div className="text-xl font-bold">{request.created_at}</div>
                </div>
              </div>
            </CardContent>
            <CardFooter></CardFooter>
          </Card>
          <div className="py-4" />
          <Card className="w-2/3">
            <CardHeader>
              <CardTitle className="flex flex-col text-2xl font-bold">
                Details
              </CardTitle>
            </CardHeader>
            <CardContent className="border py-4 mx-4 rounded-lg">
              <div className="flex flex-col">{request?.details}</div>
            </CardContent>
            <CardFooter></CardFooter>
          </Card>
          <div className="py-4" />
          <Card className="w-2/3">
            <CardHeader>
              <CardTitle className="flex flex-col text-2xl font-bold">
                Social Determinants of Health
              </CardTitle>
              <CardDescription className="text-lg">
                Selected Social Determinants of Health categories:
              </CardDescription>
            </CardHeader>
            <CardContent className="border py-4 mx-4 rounded-lg">
              <div className="flex flex-col">
                <div className="flex flex-cols-2 justify-between">
                  <div className="text-xl font-extralight pr-4">User</div>
                  <div className="text-xl font-bold">{SDOHBadges}</div>
                </div>
              </div>
            </CardContent>
            <CardFooter></CardFooter>
          </Card>
          <div className="py-4" />
          <Card className="w-2/3">
            <CardHeader>
              <CardTitle className="flex flex-col text-2xl font-bold">
                Resilient Future Fund Assistance
              </CardTitle>
              <CardDescription className="text-lg">
                Selected categories with which the Resilient Futures Fund can
                assist:
              </CardDescription>
            </CardHeader>
            <CardContent className="border py-4 mx-4 rounded-lg">
              <div className="flex flex-col">
                <div className="flex flex-cols-2 justify-between">
                  <div className="text-xl font-extralight pr-4">User</div>
                  <div className="text-xl font-bold">{RFFBadges}</div>
                </div>
              </div>
            </CardContent>
            <CardFooter></CardFooter>
          </Card>
          <div className="py-4" />
          <Card className="w-2/3">
            <CardHeader>
              <CardTitle className="flex flex-col text-2xl font-bold">
                Plan for Implementation
              </CardTitle>
              <CardDescription className="text-lg">
                User&apos;s plan for implementing the support:
              </CardDescription>
            </CardHeader>
            <CardContent className="border py-4 mx-4 rounded-lg">
              <div className="flex flex-col">
                <div className="flex flex-cols-2 justify-between">
                  {request.implementation}
                </div>
              </div>
            </CardContent>
            <CardFooter></CardFooter>
          </Card>
          <div className="py-4" />
          <Card className="w-2/3">
            <CardHeader>
              <CardTitle className="flex flex-col text-2xl font-bold">
                Plan for Sustainability
              </CardTitle>
              <CardDescription className="text-lg">
                User&apos;s plan for sustaining ongoing support, if applicable:
              </CardDescription>
            </CardHeader>
            <CardContent className="border py-4 mx-4 rounded-lg">
              <div className="flex flex-col">
                <div className="flex flex-cols-2 justify-between">
                  {request.sustainability}
                </div>
              </div>
            </CardContent>
            <CardFooter></CardFooter>
          </Card>
          <div className="py-4" />
          <Card className="w-2/3">
            <CardHeader className="flex flex-row text-2xl font-bold">
              <CardTitle className="pt-1 pr-1">Requested Funds</CardTitle>
            </CardHeader>
            <CardContent className="border py-4 mx-4 rounded-lg">
              <div className="flex flex-col">
                <div className="flex flex-cols-2 justify-between">
                  <div className="flex flex-row">
                    <div className="text-xl font-extralight pt-1.5 pr-4">
                      Funds
                    </div>
                    {request.approved || request.denied ? (
                      <div></div>
                    ) : (
                      <AddFundToRequestById requestId={requestId} />
                    )}
                  </div>
                  <div className="text-xl font-bold">{FundsBadges}</div>
                </div>
              </div>
            </CardContent>
            <CardFooter></CardFooter>
          </Card>
          <div className="py-4" />
          <Card className="w-2/3">
            <CardHeader>
              <CardTitle className="flex flex-col text-2xl font-bold">
                Pre-Screen Answers
              </CardTitle>
            </CardHeader>
            <CardContent className="border py-4 mx-4 rounded-lg">
              {request.PreScreenAnswers &&
              request.PreScreenAnswers.length > 0 ? (
                <>
                  <div className="flex flex-col">
                    <div className="flex flex-cols-2 justify-between">
                      <div className="text-xl font-extralight pr-4">
                        Housing Situation
                      </div>
                      <div className="text-xl font-bold">
                        {request.PreScreenAnswers[0].housingSituation}
                      </div>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex flex-cols-2 justify-between">
                      <div className="text-xl font-extralight pr-4">
                        Housing Quality
                      </div>
                      <div className="text-xl font-bold">
                        {request.PreScreenAnswers[0].housingQuality}
                      </div>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex flex-cols-2 justify-between">
                      <div className="text-xl font-extralight pr-4">
                        Utility Stress
                      </div>
                      <div className="text-xl font-bold">
                        {request.PreScreenAnswers[0].utilityStress}
                      </div>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex flex-cols-2 justify-between">
                      <div className="text-xl font-extralight pr-4">
                        Food Insecurity Stress
                      </div>
                      <div className="text-xl font-bold">
                        {request.PreScreenAnswers[0].foodInsecurityStress}
                      </div>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex flex-cols-2 justify-between">
                      <div className="text-xl font-extralight pr-4">
                        Food Money Stress
                      </div>
                      <div className="text-xl font-bold">
                        {request.PreScreenAnswers[0].foodMoneyStress}
                      </div>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex flex-cols-2 justify-between">
                      <div className="text-xl font-extralight pr-4">
                        Transportation Confidence
                      </div>
                      <div className="text-xl font-bold">
                        {request.PreScreenAnswers[0].transpoConfidence}
                      </div>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex flex-cols-2 justify-between">
                      <div className="text-xl font-extralight pr-4">
                        Transportation Stress
                      </div>
                      <div className="text-xl font-bold">
                        {request.PreScreenAnswers[0].transpoStress}
                      </div>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex flex-cols-2 justify-between">
                      <div className="text-xl font-extralight pr-4">
                        Financial Difficulties
                      </div>
                      <div className="text-xl font-bold">
                        {request.PreScreenAnswers[0].financialDifficulties}
                      </div>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex flex-cols-2 justify-between">
                      <div className="text-xl font-extralight pr-4">
                        Additional Information
                      </div>
                      <div className="text-xl font-bold">
                        {request.PreScreenAnswers[0].additionalInformation}
                      </div>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex flex-cols-2 justify-between">
                      <div className="text-xl font-extralight pr-4">
                        Submitted On:
                      </div>
                      <div className="text-xl font-bold">
                        {request.PreScreenAnswers[0].created_at}
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-xl font-bold text-destructive">
                  Not Started. Once {request.User.first_name} completes the
                  Pre-Screen questionnaire with their client, you&apos;ll see
                  their answers and an option to mark this request as
                  &quot;Paid&quot;.
                </div>
              )}
            </CardContent>
            <CardFooter></CardFooter>
          </Card>
          {request.agreementUrl ? (
            <>
              <div className="py-4" />
              <Card className="w-2/3">
                <CardHeader>
                  <CardTitle className="flex flex-col text-2xl font-bold">
                    Signed Agreement
                  </CardTitle>
                </CardHeader>
                <CardContent className="border py-4 mx-4 rounded-lg">
                  <Link href={request.agreementUrl}>
                    <Button className="">
                      Download <ArrowDownIcon className="pl-2" />
                    </Button>
                  </Link>
                </CardContent>
                <CardFooter></CardFooter>
              </Card>
            </>
          ) : (
            <div />
          )}
          {request.preScreenAnswer && request.approved && !request.paid ? (
            <>
              <div className="py-4" />
              <Card className="w-2/3">
                <CardHeader>
                  <CardTitle>Mark Request as Paid</CardTitle>
                  <CardDescription className="text-md">
                    Mark as paid in order to prompt user to complete post-screen
                    questionnaire with their client. If you wish to backtrack on
                    a request approval, simply click Deny.
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-row justify-around">
                  <DenyButton requestId={request.id} />
                  <MarkPaidButton
                    requestId={request.id}
                    firstName={request.User.first_name as string}
                    email={request.User.EmailAddress.email || ""}
                  />
                </CardContent>
              </Card>
            </>
          ) : (
            <></>
          )}
          <div className="py-4" />
          <Card className="w-2/3">
            <CardHeader>
              <CardTitle className="flex flex-col text-2xl font-bold">
                Post-Screen Answers
              </CardTitle>
            </CardHeader>
            <CardContent className="border py-4 mx-4 rounded-lg">
              {request.PostScreenAnswer ? (
                <>
                  <div className="flex flex-col">
                    <div className="flex flex-cols-2 justify-between">
                      <div className="text-xl font-extralight pr-4">
                        Housing Situation
                      </div>
                      <div className="text-xl font-bold">
                        {request.PostScreenAnswer?.housingSituation}
                      </div>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex flex-cols-2 justify-between">
                      <div className="text-xl font-extralight pr-4">
                        Housing Quality
                      </div>
                      <div className="text-xl font-bold">
                        {request.PostScreenAnswer?.housingQuality}
                      </div>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex flex-cols-2 justify-between">
                      <div className="text-xl font-extralight pr-4">
                        Utility Stress
                      </div>
                      <div className="text-xl font-bold">
                        {request.PostScreenAnswer?.utilityStress}
                      </div>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex flex-cols-2 justify-between">
                      <div className="text-xl font-extralight pr-4">
                        Food Insecurity Stress
                      </div>
                      <div className="text-xl font-bold">
                        {request.PostScreenAnswer?.foodInsecurityStress}
                      </div>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex flex-cols-2 justify-between">
                      <div className="text-xl font-extralight pr-4">
                        Food Money Stress
                      </div>
                      <div className="text-xl font-bold">
                        {request.PostScreenAnswer?.foodMoneyStress}
                      </div>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex flex-cols-2 justify-between">
                      <div className="text-xl font-extralight pr-4">
                        Transportation Confidence
                      </div>
                      <div className="text-xl font-bold">
                        {request.PostScreenAnswer?.transpoConfidence}
                      </div>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex flex-cols-2 justify-between">
                      <div className="text-xl font-extralight pr-4">
                        Transportation Stress
                      </div>
                      <div className="text-xl font-bold">
                        {request.PostScreenAnswer?.transpoStress}
                      </div>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex flex-cols-2 justify-between">
                      <div className="text-xl font-extralight pr-4">
                        Financial Difficulties
                      </div>
                      <div className="text-xl font-bold">
                        {request.PostScreenAnswer?.financialDifficulties}
                      </div>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex flex-cols-2 justify-between">
                      <div className="text-xl font-extralight pr-4">
                        Additional Information
                      </div>
                      <div className="text-xl font-bold">
                        {request.PostScreenAnswer?.additionalInformation}
                      </div>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex flex-cols-2 justify-between">
                      <div className="text-xl font-extralight pr-4">
                        Submitted On:
                      </div>
                      <div className="text-xl font-bold">
                        {request.PostScreenAnswer?.created_at}
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-xl font-bold text-destructive">
                  Not Started
                </div>
              )}
            </CardContent>
            <CardFooter></CardFooter>
          </Card>
        </div>
      </div>
    </>
  );
};

export default function RequestDetails({
  params,
}: {
  params: { requestid: string };
}) {
  const { sessionClaims } = auth();
  const isAdmin = (sessionClaims?.publicMetadata as any)?.admin;
  console.log(params.requestid);
  return (
    <>
      {isAdmin ? (
        <RequestPage requestid={params.requestid} />
      ) : (
        <div>Not allowed!</div>
      )}
    </>
  );
}
