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
      <div className="flex items-center justify-center py-12">
        <Card className="w-1/2">
          <CardHeader>
            <CardTitle className="flex flex-col text-2xl font-extralight">
              <div className="flex flex-row">
                <Badge className="font-bold text-lg bg-green-600">
                  {request.user.first_name} {request.user.last_name}&apos;s
                </Badge>
                <div className="px-0.5" />
                request for <div className="px-0.5" />
                <Badge className="font-bold text-lg bg-blue-600">
                  {request.client.first_name} {request.client.last_name}
                </Badge>
              </div>
              <div>
                made on{" "}
                <a className="font-bold">
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
