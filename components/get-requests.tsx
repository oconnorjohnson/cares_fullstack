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
              <TableHead>ID</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests.map((request: any) => (
              <TableRow key={request.id}>
                <TableCell>{request.id}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </>
    );
  }
}
