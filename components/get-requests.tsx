"use client";
import { useState } from "react";
import { trpc } from "@/app/_trpc/client";
import { format, parseISO } from "date-fns";
import { toast } from "sonner";
import {
  MoreHorizontalIcon,
  Terminal,
  EditIcon,
  TrashIcon,
  PlusIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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

export default function GetRequests({ userId }: { userId: string | null }) {
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
        <div className="font-bold text-2xl">My Requests</div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Client</TableHead>
              <TableHead>Agency</TableHead>
              <TableHead>Details</TableHead>
              <TableHead>SDOH Categories</TableHead>
              <TableHead>How RFF Can Assist</TableHead>
              <TableHead>Implementation Plan</TableHead>
              <TableHead>Sustainability Plan</TableHead>
              <TableHead>Requested Funds</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests.map((request) => (
              <TableRow key={request.id}>
                <TableCell>
                  {request.client?.first_name} {request.client?.last_name}
                </TableCell>
                <TableCell>{request.agency?.name}</TableCell>
                <TableCell>{request.details}</TableCell>
                <TableCell>
                  {request.SDOHs.map((sdoh) => (
                    <div key={sdoh.id}>{sdoh.value}</div>
                  ))}
                </TableCell>
                <TableCell>
                  {request.RFFs.map((rff) => (
                    <div key={rff.id}>{rff.value}</div>
                  ))}
                </TableCell>
                <TableCell>{request.implementation}</TableCell>
                <TableCell>{request.sustainability}</TableCell>
                <TableCell>
                  {request.funds.map((fund) => (
                    <div key={fund.id}>
                      ${fund.amount} - {fund.fundType.typeName}
                    </div>
                  ))}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </>
    );
  }
}
