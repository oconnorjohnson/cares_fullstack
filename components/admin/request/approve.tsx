"use client";
import { Button } from "@/components/ui/button";
import { XIcon } from "lucide-react";
import { ApproveRequest } from "@/server/actions/update/actions";
import { cn } from "@/server/utils";
import { useState } from "react";

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
  const RequestId = requestId;
  const handleApprove = async () => {
    setIsLoading(true); // Start loading
    try {
      await ApproveRequest(requestId);
    } catch (error) {
      console.error("Error approving request:", error);
    } finally {
      setIsLoading(false); // Stop loading regardless of outcome
    }
  };

  return (
    <Button onClick={handleApprove} variant="destructive">
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
