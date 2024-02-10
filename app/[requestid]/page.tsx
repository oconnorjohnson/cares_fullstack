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
import { MoreHorizontalIcon } from "lucide-react";
import FundAction from "@/components/admin/fund-action";

const RequestPage = async ({ requestid }: { requestid: string }) => {
  const requestId = Number(requestid);
  const request = await requestRequestByRequestId(requestId);
  const SDOHBadges = request.SDOHs.map((sdoh, index) => (
    <Badge key={index} className="mr-2 mb-2">
      {sdoh.value}
    </Badge>
  ));
  const RFFBadges = request.RFFs.map((rff, index) => (
    <Badge key={index} className="mr-2 mb-2">
      {rff.value}
    </Badge>
  ));
  const FundsBadges = request.funds.map((fund, index) => (
    <div key={index} className="flex items-center justify-end space-x-2 mb-2">
      <Badge className="bg-purple-500">{fund.fundType.typeName}</Badge>
      <span className="text-lg font-semibold">${fund.amount}</span>
      <FundAction fundId={fund.id}>
        <MoreHorizontalIcon />
      </FundAction>
    </div>
  ));

  return (
    <>
      <div className="flex flex-col items-center justify-center py-12">
        <Card className="w-2/3">
          <CardHeader>
            <CardTitle className="flex flex-col text-2xl font-extralight">
              <div className="flex flex-row">
                <Badge className="font-bold text-lg bg-green-600">
                  {request.user.first_name}&apos;s
                </Badge>
                <div className="px-1" />
                request for
                <div className="px-1" />
                <Badge className="font-bold text-lg bg-blue-600">
                  {request.client.first_name}
                </Badge>
                <div className="px-1" />
                made on
                <a className="pl-1 font-bold">
                  {formatDateWithSuffix(request.createdAt)}.
                </a>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="border py-4 mx-4 rounded-lg">
            <div className="flex flex-col">
              <div className="flex flex-cols-2 justify-between">
                <div className="text-xl font-extralight pr-4">User</div>
                <div className="text-xl font-bold">
                  {request.user.first_name} {request.user.last_name}
                </div>
              </div>
              <Separator className="my-2" />
              <div className="flex flex-cols-2 justify-between">
                <div className="text-xl font-extralight pr-4">Client</div>
                <div className="text-xl font-bold">
                  {request.client.first_name} {request.client.last_name}
                </div>
              </div>
              <Separator className="my-2" />
              <div className="flex flex-cols-2 justify-between">
                <div className="text-xl font-extralight pr-4">Agency</div>
                <div className="text-xl font-bold">{request.agency.name}</div>
              </div>
              <Separator className="my-2" />
              <div className="flex flex-cols-2 justify-between">
                <div className="text-xl font-extralight pr-4">Status</div>
                <div className="text-xl font-bold">
                  {request.pendingApproval ? (
                    <Badge className="bg-yellow-500 text-lg">
                      Pending Approval
                    </Badge>
                  ) : request.approved ? (
                    <Badge className="bg-green-600 text-lg">Approved</Badge>
                  ) : (
                    <Badge className="bg-red-600 text-lg">Not Approved</Badge>
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
            <CardTitle className="flex flex-col text-2xl font-extralight">
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
            <CardTitle className="flex flex-col text-2xl font-extralight">
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
            <CardTitle className="flex flex-col text-2xl font-extralight">
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
            <CardTitle className="flex flex-col text-2xl font-extralight">
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
