"use client";
import { useState } from "react";
import { trpc } from "@/app/_trpc/client";
import { format, parseISO } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontalIcon, Terminal, InfoIcon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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
import { Input } from "@/components/ui/input";
import { formatDateWithSuffix } from "@/components/user/get-requests";

export default function GetRequests() {
  const [filter, setFilter] = useState("all");
  const [selectedUserId, setSelectedUserId] = useState<string | undefined>(
    undefined,
  );
  const trpcContext = trpc.useUtils();
  const {
    data: requests,
    isLoading,
    isError,
  } = trpc.getAdminRequests.useQuery(
    { filter, userId: selectedUserId },
    {
      keepPreviousData: true,
    },
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (isError) {
    return <div>Error fetching requests.</div>;
  }

  const handleFilterChange = (newFilter: string) => {
    setFilter(newFilter);
    // reset selected user when changing filters to avoid confusion
    if (newFilter !== "byUser") {
      setSelectedUserId(undefined);
    }
    trpcContext.getAdminRequests.invalidate();
  };

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button>Filter: {filter}</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onSelect={() => handleFilterChange("all")}>
              Filter: All
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => handleFilterChange("pending")}>
              Filter: Pending
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => handleFilterChange("approved")}>
              Filter: Approved
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => handleFilterChange("byUser")}>
              Filter: By User
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        {filter === "byUser" && (
          <Input
            type="text"
            placeholder="Enter User ID"
            value={selectedUserId || ""}
            onChange={(e) => setSelectedUserId(e.target.value)}
          />
        )}
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Client</TableHead>
            <TableHead>Agency</TableHead>
            <TableHead>Submitted</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {requests?.map((request) => (
            <TableRow key={request.id}>
              <TableCell>
                {request.client?.first_name} {request.client?.last_name}
              </TableCell>
              <TableCell>{request.agency?.name}</TableCell>
              <TableCell>
                {format(parseISO(request.createdAt), "MM/dd/yyyy")}
              </TableCell>
              <TableCell>
                <Badge
                  className={
                    request.pendingApproval
                      ? "bg-yellow-400 text-black"
                      : "bg-green-600"
                  }
                >
                  {request.pendingApproval ? "Pending Approval" : "Approved"}
                </Badge>
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
                        A summary of {request.client?.first_name}&apos;s request
                        from {formatDateWithSuffix(parseISO(request.createdAt))}
                        .
                      </DialogDescription>
                    </DialogHeader>
                    <ScrollArea className="h-96 w-100 rounded-md border">
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-2 items-center gap-4">
                          <Label htmlFor="first_name" className="text-right">
                            Name
                          </Label>
                          <div>
                            {request.client?.first_name}{" "}
                            {request.client?.last_name}
                          </div>
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
                            {format(parseISO(request.createdAt), "MM/dd/yyyy")}
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
                          <Label htmlFor="requestStatus" className="text-right">
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
                          <Button
                            variant="destructive"
                            className="text-black text-md"
                          >
                            Deny
                          </Button>
                        </div>
                        <div className="flex justify-center">
                          <Button className="bg-yellow-400 text-black text-md">
                            Edit
                          </Button>
                        </div>
                        <div className="flex justify-end">
                          <Button className="bg-green-600  text-black text-md">
                            Approve
                          </Button>
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
