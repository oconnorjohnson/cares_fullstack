"use client";
import { useState } from "react";
import { trpc } from "@/app/_trpc/client";
import { format, parseISO } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontalIcon, Terminal, InfoIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import CompletePreScreen from "@/components/forms/pre-screen";
import CompletePostScreen from "@/components/forms/post-screen";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogTrigger,
  DialogHeader,
  DialogDescription,
  DialogContent,
  DialogTitle,
  DialogClose,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { formatDateWithSuffix } from "@/server/utils";

export default function GetRequests({ userId }: { userId: string | null }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState<number | null>(
    null,
  );
  const openConfirmDialog = (requestId: number) => {
    setSelectedRequestId(requestId);
    setIsDialogOpen(true);
  };
  const {
    data: requests,
    isLoading,
    isError,
  } = trpc.getRequests.useQuery(userId as string, {
    enabled: !!userId,
  });
  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (isError) {
    return <div>Error fetching clients.</div>;
  }
  if (requests && requests.length === 0) {
    return (
      <Alert>
        <Terminal className="h-4 w-4" />
        <AlertTitle>Heads up!</AlertTitle>
        <AlertDescription>
          Click on <strong>Submit New Request</strong> to make your first
          request!
        </AlertDescription>
      </Alert>
    );
  } else {
    return (
      <>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Client</TableHead>
              <TableHead>Agency</TableHead>
              <TableHead>Submitted</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests.map((request) => (
              <TableRow key={request.id}>
                <TableCell>{request.client?.clientId}</TableCell>
                <TableCell>{request.agency?.name}</TableCell>
                <TableCell>
                  {format(parseISO(request.createdAt), "MM/dd/yyyy")}
                </TableCell>
                <TableCell>
                  {request.pendingApproval ? (
                    <Badge className="bg-yellow-400 text-black">
                      Pending Approval
                    </Badge>
                  ) : request.approved ? (
                    <Badge className="bg-green-600">Approved</Badge>
                  ) : request.denied ? (
                    <Badge className="bg-red-500">Denied</Badge>
                  ) : (
                    <Badge className="bg-yellow-400 text-black">
                      Awaiting Review
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  {request.hasPreScreen &&
                  !request.hasPostScreen &&
                  !request.paid ? (
                    <div>No actions required at this time.</div>
                  ) : !request.hasPreScreen ? (
                    <CompletePreScreen requestId={request.id} />
                  ) : request.hasPreScreen &&
                    !request.hasPostScreen &&
                    request.paid ? (
                    <CompletePostScreen requestId={request.id} />
                  ) : request.hasPreScreen && request.hasPostScreen ? (
                    <div>Request Completed and Closed.</div>
                  ) : null}
                </TableCell>
                <TableCell>
                  <Dialog>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="icon" variant="ghost">
                          <MoreHorizontalIcon />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DialogTrigger asChild>
                          <DropdownMenuItem>
                            <div className="flex text-md flex-row items-center">
                              <InfoIcon size={15} />
                              <div className="px-1" />
                              View Request
                            </div>
                          </DropdownMenuItem>
                        </DialogTrigger>
                      </DropdownMenuContent>
                    </DropdownMenu>

                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Request Details</DialogTitle>
                        <DialogDescription>
                          A summary of {request.client?.clientId}&apos;s request
                          from{" "}
                          {formatDateWithSuffix(parseISO(request.createdAt))}.
                        </DialogDescription>
                      </DialogHeader>
                      <ScrollArea className="h-96 w-100 rounded-md border">
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-2 items-center gap-4">
                            <Label htmlFor="first_name" className="text-right">
                              Name
                            </Label>
                            <div>{request.client?.clientId}</div>
                          </div>
                          <div className="grid grid-cols-2 items-center gap-4">
                            <Label htmlFor="last_name" className="text-right">
                              Agency
                            </Label>
                            <div>{request.agency.name}</div>
                          </div>
                          <div className="grid grid-cols-2 items-center gap-4">
                            <Label htmlFor="sex" className="text-right">
                              Submitted
                            </Label>
                            <div>
                              {format(
                                parseISO(request.createdAt),
                                "MM/dd/yyyy",
                              )}
                            </div>
                          </div>
                          <div className="grid grid-cols-2 items-center gap-4">
                            <Label htmlFor="race" className="text-right">
                              Details
                            </Label>
                            <div>{request.details}</div>
                          </div>
                          <div className="grid grid-cols-2 items-center gap-4">
                            <Label htmlFor="contactInfo" className="text-right">
                              Selected SDOH Categories
                            </Label>
                            <div>
                              {request.SDOHs.map((sdoh) => (
                                <div key={sdoh.id}>{sdoh.value}</div>
                              ))}
                            </div>
                          </div>
                          <div className="grid grid-cols-2 items-center gap-4">
                            <Label htmlFor="contactInfo" className="text-right">
                              Selected RFF Categories
                            </Label>
                            <div>
                              {request.RFFs.map((rff) => (
                                <div key={rff.id}>{rff.value}</div>
                              ))}
                            </div>
                          </div>
                          <div className="grid grid-cols-2 items-center gap-4">
                            <Label htmlFor="caseNumber" className="text-right">
                              Plan for Implementation
                            </Label>
                            <div>{request.implementation}</div>
                          </div>
                          <div className="grid grid-cols-2 items-center gap-4">
                            <Label htmlFor="contactInfo" className="text-right">
                              Plan for Sustainability
                            </Label>
                            <div>{request.sustainability}</div>
                          </div>
                          <div className="grid grid-cols-2 items-center gap-4">
                            <Label htmlFor="contactInfo" className="text-right">
                              Requested Funds
                            </Label>
                            <div>
                              {request.funds.map((fund) => (
                                <div key={fund.id}>
                                  {fund.fundType.typeName === "Bus Pass"
                                    ? ""
                                    : "$"}
                                  {fund.amount} - {fund.fundType.typeName}
                                  {fund.fundType.typeName === "Bus Pass"
                                    ? "es"
                                    : ""}
                                </div>
                              ))}
                            </div>
                          </div>
                          <div className="grid grid-cols-2 items-center gap-4">
                            <Label
                              htmlFor="requestStatus"
                              className="text-right"
                            >
                              Request Status
                            </Label>
                            <div>
                              {request.pendingApproval ? (
                                <Badge className="bg-yellow-400 text-black">
                                  Pending Approval
                                </Badge>
                              ) : request.approved ? (
                                <Badge className="bg-green-600">Approved</Badge>
                              ) : (
                                <Badge className="bg-yellow-400 text-black">
                                  Awaiting Review
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </ScrollArea>
                      <DialogFooter>
                        <div className="flex justify-between w-full">
                          <div className="flex justify-start">
                            <DialogClose asChild>
                              <Button>Cancel</Button>
                            </DialogClose>
                          </div>
                          <div className="flex justify-end">
                            <Button type="submit">Save changes</Button>
                          </div>
                        </div>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </>
    );
  }
}
