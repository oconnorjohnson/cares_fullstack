"use client";
import React, { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogHeader,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Label } from "@/components/ui/label";
import { formatDateWithSuffix } from "@/server/utils";
import { format, parseISO } from "date-fns";
import { requestRequestByRequestId } from "@/server/actions/request/actions";
import { trpc } from "@/app/_trpc/client";
import type { RequestData } from "@/server/actions/request/actions";
interface ViewRequestProps {
  requestId: number;
}

const ViewRequest: React.FC<ViewRequestProps> = ({ requestId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const {
    data: requestData,
    isLoading,
    isError,
  } = trpc.getRequest.useQuery(requestId, {
    enabled: isOpen,
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError || !requestData) {
    return <div>Request not found or failed to fetch request data.</div>;
  }

  const formattedDate = requestData.createdAt
    ? formatDateWithSuffix(parseISO(requestData.createdAt))
    : "N/A";
  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild onClick={() => setIsOpen(true)}>
          View Details
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request Details</DialogTitle>
            <DialogDescription>
              A summary of {requestData.client?.first_name}&apos;s request from{" "}
              {formattedDate}.
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-96 w-100 rounded-md border">
            {/* Display your request data here */}
            <p>Details: {requestData.details}</p>
            <p>
              Created At:{" "}
              {requestData.createdAt
                ? new Date(requestData.createdAt).toLocaleDateString()
                : "N/A"}
            </p>
            {/* Add more fields as needed */}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ViewRequest;
