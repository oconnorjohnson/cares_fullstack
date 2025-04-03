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
import { isAnyNull } from "@/server/actions/request/actions";
import { format } from "date-fns";
import type { RequestData } from "@/server/actions/request/actions";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  GetRFFWalmartCards,
  GetRFFArcoCards,
} from "@/server/actions/request/actions";
import {
  hasAdminAgreed,
  isAdminOneNull,
  isAdminTwoNull,
} from "@/server/actions/request/actions";
import RollbackButton from "@/components/admin/request/rollback-button";
import { getFundsSumByRequestId } from "@/server/actions/request/actions";
import AgreeButton from "@/components/admin/request/agree-button";
import CompleteRequestDialog from "@/components/admin/request/complete-request-dialog";
// import dynamic from "next/dynamic";
// const DenyButton = dynamic(() => import("@/components/admin/request/deny"), {
//   ssr: false,
// });

interface Fund {
  fundTypeId: number;
  amount: number;
}

const RequestPage = async ({ requestid }: { requestid: string }) => {
  const { userId: currentAdminUserId } = await auth();
  const rffWalmartCards = await GetRFFWalmartCards();
  const rffArcoCards = await GetRFFArcoCards();
  const requestId = Number(requestid);
  const isFirstAdminNull = await isAdminOneNull(requestId);
  const isSecondAdminNull = await isAdminTwoNull(requestId);
  const totalValue = await getFundsSumByRequestId(requestId);
  const result = await requestRequestByRequestId(requestId);
  if (!Array.isArray(result)) {
    throw new Error("Expected an array");
  }
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
  const isAnyAdminNull = await isAnyNull(requestId);
  const hasCurrentAdminAgreed = await hasAdminAgreed({
    requestId,
    userId: currentAdminUserId!,
  });
  const createdAt = format(new Date(request.created_at), "MM/dd/yyyy");
  const FundsBadges = request.Fund?.map((fund: any, index: number) => (
    <div
      key={index}
      className="flex items-center text-sm justify-end space-x-2 mb-2"
    >
      {fund.FundType.typeName === "Walmart Gift Card" ? (
        <HoverCard>
          <HoverCardTrigger asChild>
            <Badge className="text-sm">{fund.FundType.typeName}</Badge>
          </HoverCardTrigger>
          <HoverCardContent>
            <ScrollArea className="h-96 w-48  rounded-md border">
              <div className="flex flex-col p-4">
                Available RFF-Funded Card Amounts:
                <div className="py-2" />
                {rffWalmartCards.map(
                  (card: { totalValue: number }, index: number) => (
                    <div key={index} className="mb-2">
                      {card.totalValue}
                    </div>
                  ),
                )}
              </div>
            </ScrollArea>
          </HoverCardContent>
        </HoverCard>
      ) : fund.FundType.typeName === "Arco Gift Card" ? (
        <HoverCard>
          <HoverCardTrigger asChild>
            <Badge className="text-sm">{fund.FundType.typeName}</Badge>
          </HoverCardTrigger>
          <HoverCardContent>
            <ScrollArea className="h-96 w-48 rounded-md border">
              <div className="flex flex-col p-4 ">
                Available RFF-Funded Card Amounts:
                {rffArcoCards.map(
                  (card: { totalValue: number }, index: number) => (
                    <div key={index} className="mb-2">
                      {card.totalValue}
                    </div>
                  ),
                )}
              </div>
            </ScrollArea>
          </HoverCardContent>
        </HoverCard>
      ) : (
        <Badge className="text-sm">{fund.FundType.typeName}</Badge>
      )}
      <div className="px-2" />
      {fund.FundType.typeName === "Bus Pass" ? (
        <span className="text-lg font-semibold">{fund.amount}</span>
      ) : (
        <span className="text-lg font-semibold">${fund.amount}</span>
      )}
      <div className="px-2" />
      {fund.Receipt[0]?.url && fund.Receipt[0].url !== "" ? (
        <Link
          href={fund.Receipt[0].url}
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
          needsReceipt={fund.needsReceipt}
        />
      )}
    </div>
  ));
  return (
    <>
      <div className="w-5/6 border-t items-center justify-start">
        <div className="flex flex-col items-center justify-center py-12">
          <Card className="w-2/3">
            <CardHeader>
              <CardTitle className="flex flex-cols-3 justify-between">
                <div className="text-center text-3xl pt-0.5">
                  {request?.User.first_name}&apos;s request from {createdAt}
                </div>
                <div className="flex flex-row justify-between px-6">
                  {request.pendingApproval ? (
                    <>
                      <DenyButton requestId={requestId} />
                      <div className="px-2" />

                      {isFirstAdminNull ? (
                        hasCurrentAdminAgreed ? (
                          <Button disabled>Agreed</Button>
                        ) : (
                          <AgreeButton
                            requestId={requestId}
                            userId={currentAdminUserId!}
                          />
                        )
                      ) : totalValue <= 250 ? (
                        <ApproveButton requestId={requestId} />
                      ) : isSecondAdminNull ? (
                        hasCurrentAdminAgreed ? (
                          <Button disabled>Agreed</Button>
                        ) : (
                          <AgreeButton
                            requestId={requestId}
                            userId={currentAdminUserId!}
                          />
                        )
                      ) : (
                        <ApproveButton requestId={requestId} />
                      )}
                    </>
                  ) : (
                    <></>
                  )}
                  {request.denied ? (
                    <RollbackButton requestId={requestId} />
                  ) : (
                    <></>
                  )}
                  {request.paid && !request.completed ? (
                    <>
                      <CompleteRequestDialog
                        requestId={requestId}
                        UserId={currentAdminUserId!}
                        originalAmount={
                          request.funds.find((f: Fund) => f.fundTypeId === 5)
                            ?.amount || 0
                        }
                      />
                    </>
                  ) : (
                    <></>
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

                  <div className="text-xl font-bold underline hover:text-zinc-500">
                    {request.Client.clientID}
                  </div>
                </div>
                <Separator className="my-2" />
                <div className="flex flex-cols-2 justify-between">
                  <div className="text-xl font-extralight pr-4">Email</div>
                  <Link href={`mailto:${request.User.EmailAddress.email}`}>
                    <div className="text-xl font-bold underline hover:text-zinc-500">
                      {request.User.EmailAddress[0].email}
                    </div>
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
                  <div className="text-xl font-bold">{createdAt}</div>
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
            <CardHeader className="flex flex-col ">
              <CardTitle className="pt-1 pr-1 text-2xl font-bold">
                Requested Funds
              </CardTitle>
              <CardDescription className="text-lg">
                Hover over Gift Card badges to see the available card values.
                Card values must match available cards in order to approve the
                request.
              </CardDescription>
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
          {request.PreScreenAnswers && request.approved && !request.paid ? (
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
                    UserId={request.userId}
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
              {request.PostScreenAnswers &&
              request.PostScreenAnswers.length > 0 ? (
                <>
                  <div className="flex flex-col">
                    <div className="flex flex-cols-2 justify-between">
                      <div className="text-xl font-extralight pr-4">
                        Housing Situation
                      </div>
                      <div className="text-xl font-bold">
                        {request.PostScreenAnswers[0].housingSituation}
                      </div>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex flex-cols-2 justify-between">
                      <div className="text-xl font-extralight pr-4">
                        Housing Quality
                      </div>
                      <div className="text-xl font-bold">
                        {request.PostScreenAnswers[0].housingQuality}
                      </div>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex flex-cols-2 justify-between">
                      <div className="text-xl font-extralight pr-4">
                        Utility Stress
                      </div>
                      <div className="text-xl font-bold">
                        {request.PostScreenAnswers[0].utilityStress}
                      </div>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex flex-cols-2 justify-between">
                      <div className="text-xl font-extralight pr-4">
                        Food Insecurity Stress
                      </div>
                      <div className="text-xl font-bold">
                        {request.PostScreenAnswers[0].foodInsecurityStress}
                      </div>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex flex-cols-2 justify-between">
                      <div className="text-xl font-extralight pr-4">
                        Food Money Stress
                      </div>
                      <div className="text-xl font-bold">
                        {request.PostScreenAnswers[0].foodMoneyStress}
                      </div>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex flex-cols-2 justify-between">
                      <div className="text-xl font-extralight pr-4">
                        Transportation Confidence
                      </div>
                      <div className="text-xl font-bold">
                        {request.PostScreenAnswers[0].transpoConfidence}
                      </div>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex flex-cols-2 justify-between">
                      <div className="text-xl font-extralight pr-4">
                        Transportation Stress
                      </div>
                      <div className="text-xl font-bold">
                        {request.PostScreenAnswers[0].transpoStress}
                      </div>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex flex-cols-2 justify-between">
                      <div className="text-xl font-extralight pr-4">
                        Financial Difficulties
                      </div>
                      <div className="text-xl font-bold">
                        {request.PostScreenAnswers[0].financialDifficulties}
                      </div>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex flex-cols-2 justify-between">
                      <div className="text-xl font-extralight pr-4">
                        Additional Information
                      </div>
                      <div className="text-xl font-bold">
                        {request.PostScreenAnswers[0].additionalInformation}
                      </div>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex flex-cols-2 justify-between">
                      <div className="text-xl font-extralight pr-4">
                        Submitted On:
                      </div>

                      <div className="text-xl font-bold">
                        {request.PostScreenAnswers[0].created_at}
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
