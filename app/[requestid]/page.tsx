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

const RequestPage = async ({ requestid }: { requestid: string }) => {
  const requestId = Number(requestid);
  const request = await requestRequestByRequestId(requestId);
  return (
    <>
      <div className="flex flex-col items-center justify-center py-12">
        <Card className="w-2/3">
          <CardHeader>
            <CardTitle className="flex flex-col text-2xl font-extralight">
              <div className="flex flex-row">
                <Badge className="font-bold text-lg bg-green-600">
                  {request.user.first_name} {request.user.last_name}&apos;s
                </Badge>
                <div className="px-1" />
                request for
                <div className="px-1" />
                <Badge className="font-bold text-lg bg-blue-600">
                  {request.client.first_name} {request.client.last_name}
                </Badge>
                <div className="px-1" />
                made on
                <a className="pl-1 font-bold">
                  {formatDateWithSuffix(request.createdAt)}.
                </a>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="border border-2 py-4 mx-4 rounded-lg">
            <div className="flex flex-col">
              <div className="flex flex-cols-2 justify-between">
                <div className="text-xl font-extralight">User</div>
                <div className="text-xl font-bold">
                  {request.user.first_name} {request.user.last_name}
                </div>
              </div>
              <Separator className="my-2" />
              <div className="flex flex-cols-2 justify-between">
                <div className="text-xl font-extralight">Client</div>
                <div className="text-xl font-bold">
                  {request.client.first_name} {request.client.last_name}
                </div>
              </div>
              <Separator className="my-2" />
              <div className="flex flex-cols-2 justify-between">
                <div className="text-xl font-extralight">Agency</div>
                <div className="text-xl font-bold">{request.agency.name}</div>
              </div>
              <Separator className="my-2" />
              <div className="flex flex-cols-2 justify-between">
                <div className="text-xl font-extralight">Status</div>
                <div className="text-xl font-bold">{request.agency.name}</div>
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
          <CardContent className="border border-2 py-4 mx-4 rounded-lg">
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
          <CardContent className="border border-2 py-4 mx-4 rounded-lg">
            <div className="flex flex-col">
              <div className="flex flex-cols-2 justify-between">
                <div className="text-xl font-extralight">User</div>
                <div className="text-xl font-bold">
                  {request.user.first_name} {request.user.last_name}
                </div>
              </div>
              <Separator className="my-2" />
              <div className="flex flex-cols-2 justify-between">
                <div className="text-xl font-extralight">Client</div>
                <div className="text-xl font-bold">
                  {request.client.first_name} {request.client.last_name}
                </div>
              </div>
              <Separator className="my-2" />
              <div className="flex flex-cols-2 justify-between">
                <div className="text-xl font-extralight">Agency</div>
                <div className="text-xl font-bold">{request.agency.name}</div>
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
          <CardContent className="border border-2 py-4 mx-4 rounded-lg">
            <div className="flex flex-col">
              <div className="flex flex-cols-2 justify-between">
                <div className="text-xl font-extralight">User</div>
                <div className="text-xl font-bold">
                  {request.user.first_name} {request.user.last_name}
                </div>
              </div>
              <Separator className="my-2" />
              <div className="flex flex-cols-2 justify-between">
                <div className="text-xl font-extralight">Client</div>
                <div className="text-xl font-bold">
                  {request.client.first_name} {request.client.last_name}
                </div>
              </div>
              <Separator className="my-2" />
              <div className="flex flex-cols-2 justify-between">
                <div className="text-xl font-extralight">Agency</div>
                <div className="text-xl font-bold">{request.agency.name}</div>
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
          <CardContent className="border border-2 py-4 mx-4 rounded-lg">
            <div className="flex flex-col">
              <div className="flex flex-cols-2 justify-between">
                <div className="text-xl font-extralight">Fund</div>
                <div className="text-xl font-bold">
                  {request.user.first_name} {request.user.last_name}
                </div>
              </div>
              <Separator className="my-2" />
              <div className="flex flex-cols-2 justify-between">
                <div className="text-xl font-extralight">Client</div>
                <div className="text-xl font-bold">
                  {request.client.first_name} {request.client.last_name}
                </div>
              </div>
              <Separator className="my-2" />
              <div className="flex flex-cols-2 justify-between">
                <div className="text-xl font-extralight">Agency</div>
                <div className="text-xl font-bold">{request.agency.name}</div>
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
