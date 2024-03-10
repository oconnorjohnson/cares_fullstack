import { auth } from "@clerk/nextjs";
import { getClientById } from "@/server/actions/request/actions";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export const runtime = "edge";

const ClientDetails = async ({ clientId }: { clientId: string }) => {
  const ClientId = Number(clientId);
  const client = await getClientById(ClientId);
  console.log(client);
  return (
    <>
      <div className="flex flex-col items-center justify-center py-12">
        <Card className="w-2/3">
          <CardHeader>
            <CardTitle className="flex flex-cols-3 justify-between">
              <div className="text-center text-3xl pt-0.5">
                {client?.clientId} | {client?.first_name} {client?.last_name}
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="border py-4 mx-4 rounded-lg">
            <div className="flex flex-col">
              <div className="flex flex-cols-2 justify-between">
                <div className="text-xl font-extralight pr-4">Sex</div>
                <div className="text-xl font-bold">{client?.sex}</div>
              </div>
              <Separator className="my-2" />
              <div className="flex flex-cols-2 justify-between">
                <div className="text-xl font-extralight pr-4">Race</div>
                <div className="text-xl font-bold">{client?.race}</div>
              </div>
            </div>
          </CardContent>
          <CardFooter></CardFooter>
        </Card>
      </div>
      <div className="flex flex-col items-center justify-center py-12">
        <Card className="w-2/3">
          <CardHeader>
            <CardTitle className="flex flex-cols-3 justify-between">
              Completed Requests by Client Table Coming Soon
            </CardTitle>
          </CardHeader>
        </Card>
      </div>
    </>
  );
};

export default function ClientPage({
  params,
}: {
  params: { clientid: string };
}) {
  const { sessionClaims } = auth();
  const isAdmin = (sessionClaims?.publicMetadata as any)?.admin;
  return (
    <>
      {isAdmin ? (
        <ClientDetails clientId={params.clientid} />
      ) : (
        <div>Not Allowed!</div>
      )}
    </>
  );
}
