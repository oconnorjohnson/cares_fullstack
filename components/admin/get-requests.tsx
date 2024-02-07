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
    setSelectedUserId(undefined);
  };

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button>Filter: {filter}</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Filter: All</DropdownMenuItem>
            <DropdownMenuItem>Filter: Pending</DropdownMenuItem>
            <DropdownMenuItem>Filter: Approved</DropdownMenuItem>
            {/* <DropdownMenuItem>Filter: Denied</DropdownMenuItem> */}
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
                <Button size="icon" variant="ghost">
                  <MoreHorizontalIcon />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
