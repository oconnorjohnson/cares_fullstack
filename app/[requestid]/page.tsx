import { auth } from "@clerk/nextjs";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from "@/components/ui/table";
import { requestRequestByRequestId } from "@/server/actions/request/actions";

const RequestPage = async ({ requestid }: { requestid: string }) => {
  const requestId = Number(requestid);
  const request = await requestRequestByRequestId(requestId);
  return (
    <>
      <div>
        <Table>
          <TableCaption>{request.client.first_name}</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead></TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell></TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableBody>
          <TableFooter></TableFooter>
        </Table>
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
      <div>
        {isAdmin ? (
          <RequestPage requestid={params.requestid} />
        ) : (
          <div>Not allowed!</div>
        )}
      </div>
    </>
  );
}
