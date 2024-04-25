"use client";
import { Button } from "@/components/ui/button";
import { XIcon } from "lucide-react";
import ApproveRequest from "@/server/actions/rff/approve";
// import { ApproveRequest } from "@/server/actions/update/actions";
import { cn } from "@/server/utils";
import { useState } from "react";
import { trpc } from "@/app/_trpc/client";
import { toast } from "sonner";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export default function Approve({ requestId }: { requestId: number }) {
  const [isDataLoading, setIsDataLoading] = useState(false);
  const trpcContext = trpc.useUtils();
  const { data: user } = trpc.getUserDetailsByRequestId.useQuery(requestId);
  const email = user?.EmailAddress[0]?.email || "";
  const firstName = user?.first_name || "";
  const UserId = user?.userId || "";
  const handleApprove = async () => {
    setIsDataLoading(true);
    try {
      await ApproveRequest(requestId, firstName, email, UserId);
      toast.success("Request approved.");
    } catch (error) {
      console.error("Error approving request:", error);
      toast.error("Failed to approve request.");
    } finally {
      setIsDataLoading(false);
      trpcContext.invalidate();
    }
  };

  return (
    <Button
      onClick={handleApprove}
      variant="confirmation"
      disabled={isDataLoading}
    >
      {isDataLoading ? (
        <LoadingSpinner className="w-4 h-4 text-white" />
      ) : (
        <>
          Approve
          <div className="px-1" />
          <XIcon />
        </>
      )}
    </Button>
  );
}
