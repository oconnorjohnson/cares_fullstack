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
import { XIcon, CheckIcon, ArrowLeftIcon } from "lucide-react";
import FundAction from "@/components/admin/fund-actions";
import Link from "next/link";
import DenyButton from "@/components/admin/request/deny";
import ApproveButton from "@/components/admin/request/approve";

// const ApproveFunction = async ({ requestId }: { requestId: string }) => {
//   const RequestId = Number(requestId);
//   const approve = await ApproveRequest(RequestId);
//   return approve;
// };

// const DenyFunction = async ({ requestId }: { requestId: string }) => {
//   const RequestId = Number(requestId);
//   const deny = await DenyRequest(RequestId);
//   return deny;
// };

const RequestPage = async ({ requestid }: { requestid: string }) => {
  const requestId = Number(requestid);
  const request = await requestRequestByRequestId(requestId);
  const SDOHBadges = request.SDOHs.map((sdoh, index) => (
    <Badge key={index} className="mr-2 mb-2 text-sm">
      {sdoh.value}
    </Badge>
  ));
  const RFFBadges = request.RFFs.map((rff, index) => (
    <Badge key={index} className="mr-2 mb-2 text-sm">
      {rff.value}
    </Badge>
  ));
  const FundsBadges = request.funds.map((fund, index) => (
    <div
      key={index}
      className="flex items-center text-sm justify-end space-x-2 mb-2"
    >
      <Badge className="text-sm">{fund.fundType.typeName}</Badge>
      <div className="px-2" />
      <span className="text-lg font-semibold">${fund.amount}</span>
      <div className="px-2" />
      <FundAction
        fundId={fund.id}
        fundTypeId={fund.fundType.id}
        fundTypeName={fund.fundType.typeName}
        fundAmount={fund.amount}
      />
    </div>
  ));

  return (
    <>
      <div>
        <div className="pl-12">
          <Link href="/dashboard">
            <Button size="icon">
              <ArrowLeftIcon />
            </Button>
          </Link>
        </div>
        <div className="flex flex-col items-center justify-center py-12">
          <Card className="w-2/3">
            <CardHeader>
              <CardTitle className="flex flex-cols-3 justify-between">
                <DenyButton requestId={requestId} />
                <div className="text-center text-3xl pt-0.5">
                  {request.user.first_name}&apos;s request for{" "}
                  {request.client.first_name} from{" "}
                  {formatDateWithSuffix(request.createdAt)}.
                </div>
                <ApproveButton requestId={requestId} />
              </CardTitle>
            </CardHeader>
            <CardContent className="border py-4 mx-4 rounded-lg">
              <div className="flex flex-col">
                <div className="flex flex-cols-2 justify-between">
                  <div className="text-xl font-extralight pr-4">User</div>
                  <Link href={`/admin/user/${request.user.id}`}>
                    <div className="text-xl font-bold hover:underline">
                      {request.user.first_name} {request.user.last_name}
                    </div>
                  </Link>
                </div>
                <Separator className="my-2" />
                <div className="flex flex-cols-2 justify-between">
                  <div className="text-xl font-extralight pr-4">Client</div>
                  <Link href={`/admin/client/${request.client.id}`}>
                    <div className="text-xl font-bold hover:underline">
                      {request.client.first_name} {request.client.last_name}
                    </div>
                  </Link>
                </div>
                <Separator className="my-2" />
                <div className="flex flex-cols-2 justify-between">
                  <div className="text-xl font-extralight pr-4">Agency</div>
                  <div className="text-xl font-bold">{request.agency.name}</div>
                </div>
                <Separator className="my-2" />
                <div className="flex flex-cols-2 justify-between">
                  <div className="text-xl font-extralight pr-4">
                    Request Status
                  </div>
                  <div className="text-xl font-bold">
                    {request.pendingApproval ? (
                      <Badge className="bg-yellow-300 text-black text-sm">
                        Pending Approval
                      </Badge>
                    ) : request.approved ? (
                      <Badge className="bg-green-600 text-sm">Approved</Badge>
                    ) : request.denied ? (
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
                    {request.hasPreScreen ? (
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
                    {request.hasPostScreen ? (
                      <Badge className="bg-green-600 text-sm">Completed</Badge>
                    ) : (
                      <Badge className="bg-red-500 text-sm">Not Started</Badge>
                    )}
                  </div>
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
              <div className="flex flex-col">{request.details}</div>
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
                Requested Funds
              </CardTitle>
            </CardHeader>
            <CardContent className="border py-4 mx-4 rounded-lg">
              <div className="flex flex-col">
                <div className="flex flex-cols-2 justify-between">
                  <div className="text-xl font-extralight pr-4">Funds</div>
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
              {request.preScreenAnswer ? (
                <>
                  <div className="flex flex-col">
                    <div className="flex flex-cols-2 justify-between">
                      <div className="text-xl font-extralight pr-4">
                        Housing Situation
                      </div>
                      <div className="text-xl font-bold">
                        {request.preScreenAnswer?.housingSituation}
                      </div>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex flex-cols-2 justify-between">
                      <div className="text-xl font-extralight pr-4">
                        Housing Quality
                      </div>
                      <div className="text-xl font-bold">
                        {request.preScreenAnswer?.housingQuality}
                      </div>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex flex-cols-2 justify-between">
                      <div className="text-xl font-extralight pr-4">
                        Utility Stress
                      </div>
                      <div className="text-xl font-bold">
                        {request.preScreenAnswer?.utilityStress}
                      </div>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex flex-cols-2 justify-between">
                      <div className="text-xl font-extralight pr-4">
                        Food Insecurity Stress
                      </div>
                      <div className="text-xl font-bold">
                        {request.preScreenAnswer?.foodInsecurityStress}
                      </div>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex flex-cols-2 justify-between">
                      <div className="text-xl font-extralight pr-4">
                        Food Money Stress
                      </div>
                      <div className="text-xl font-bold">
                        {request.preScreenAnswer?.foodMoneyStress}
                      </div>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex flex-cols-2 justify-between">
                      <div className="text-xl font-extralight pr-4">
                        Transportation Confidence
                      </div>
                      <div className="text-xl font-bold">
                        {request.preScreenAnswer?.transpoConfidence}
                      </div>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex flex-cols-2 justify-between">
                      <div className="text-xl font-extralight pr-4">
                        Transportation Stress
                      </div>
                      <div className="text-xl font-bold">
                        {request.preScreenAnswer?.transpoStress}
                      </div>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex flex-cols-2 justify-between">
                      <div className="text-xl font-extralight pr-4">
                        Financial Difficulties
                      </div>
                      <div className="text-xl font-bold">
                        {request.preScreenAnswer?.financialDifficulties}
                      </div>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex flex-cols-2 justify-between">
                      <div className="text-xl font-extralight pr-4">
                        Additional Information
                      </div>
                      <div className="text-xl font-bold">
                        {request.preScreenAnswer?.additionalInformation}
                      </div>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex flex-cols-2 justify-between">
                      <div className="text-xl font-extralight pr-4">
                        Submitted On:
                      </div>
                      <div className="text-xl font-bold">
                        {request.preScreenAnswer?.createdAt.toDateString()}
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-xl font-bold">Incomplete</div>
              )}
            </CardContent>
            <CardFooter></CardFooter>
          </Card>
          <div className="py-4" />
          <Card className="w-2/3">
            <CardHeader>
              <CardTitle className="flex flex-col text-2xl font-bold">
                Post-Screen Answers
              </CardTitle>
            </CardHeader>
            <CardContent className="border py-4 mx-4 rounded-lg">
              {request.postScreenAnswer ? (
                <>
                  <div className="flex flex-col">
                    <div className="flex flex-cols-2 justify-between">
                      <div className="text-xl font-extralight pr-4">
                        Housing Situation
                      </div>
                      <div className="text-xl font-bold">
                        {request.postScreenAnswer?.housingSituation}
                      </div>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex flex-cols-2 justify-between">
                      <div className="text-xl font-extralight pr-4">
                        Housing Quality
                      </div>
                      <div className="text-xl font-bold">
                        {request.postScreenAnswer?.housingQuality}
                      </div>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex flex-cols-2 justify-between">
                      <div className="text-xl font-extralight pr-4">
                        Utility Stress
                      </div>
                      <div className="text-xl font-bold">
                        {request.postScreenAnswer?.utilityStress}
                      </div>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex flex-cols-2 justify-between">
                      <div className="text-xl font-extralight pr-4">
                        Food Insecurity Stress
                      </div>
                      <div className="text-xl font-bold">
                        {request.postScreenAnswer?.foodInsecurityStress}
                      </div>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex flex-cols-2 justify-between">
                      <div className="text-xl font-extralight pr-4">
                        Food Money Stress
                      </div>
                      <div className="text-xl font-bold">
                        {request.postScreenAnswer?.foodMoneyStress}
                      </div>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex flex-cols-2 justify-between">
                      <div className="text-xl font-extralight pr-4">
                        Transportation Confidence
                      </div>
                      <div className="text-xl font-bold">
                        {request.postScreenAnswer?.transpoConfidence}
                      </div>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex flex-cols-2 justify-between">
                      <div className="text-xl font-extralight pr-4">
                        Transportation Stress
                      </div>
                      <div className="text-xl font-bold">
                        {request.postScreenAnswer?.transpoStress}
                      </div>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex flex-cols-2 justify-between">
                      <div className="text-xl font-extralight pr-4">
                        Financial Difficulties
                      </div>
                      <div className="text-xl font-bold">
                        {request.postScreenAnswer?.financialDifficulties}
                      </div>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex flex-cols-2 justify-between">
                      <div className="text-xl font-extralight pr-4">
                        Additional Information
                      </div>
                      <div className="text-xl font-bold">
                        {request.postScreenAnswer?.additionalInformation}
                      </div>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex flex-cols-2 justify-between">
                      <div className="text-xl font-extralight pr-4">
                        Submitted On:
                      </div>
                      <div className="text-xl font-bold">
                        {request.postScreenAnswer?.createdAt.toDateString()}
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-xl font-bold">Incomplete</div>
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