"use client";
import { Button } from "@/components/ui/button";
import { XIcon } from "lucide-react";
import { ApproveRequest } from "@/server/actions/update/actions";
import { cn } from "@/server/utils";
import { useState } from "react";
import { trpc } from "@/app/_trpc/client";
import { toast } from "sonner";
import { useUser } from "@clerk/nextjs";
import { Approved } from "@/server/actions/resend/actions";
export const LoadingSpinner = ({ className }: { className: any }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("animate-spin", className)}
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
};

export default function Approve({ requestId }: { requestId: number }) {
  const [isLoading, setIsLoading] = useState(false);
  const trpcContext = trpc.useUtils();
  const { user } = useUser();
  const email = user?.emailAddresses[0]?.emailAddress || "";
  const firstName = user?.firstName || "";
  const handleApprove = async () => {
    setIsLoading(true);
    try {
      await ApproveRequest(requestId);
      toast.success("Request approved.");
      try {
        await Approved({ firstName, email });
      } catch (error) {
        console.error("Failed to submit:", error);
      }
    } catch (error) {
      console.error("Error approving request:", error);
      toast.error("Failed to approve request.");
    } finally {
      setIsLoading(false);
      trpcContext.invalidate();
    }
  };

  return (
    <Button onClick={handleApprove} variant="confirmation">
      {isLoading ? (
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
