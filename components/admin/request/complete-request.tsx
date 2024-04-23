"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { toast } from "sonner";
import { completeRequest } from "@/server/actions/rff/complete";

export default function CompleteRequestButton({
  requestId,
  UserId,
}: {
  requestId: number;
  UserId: string;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const CompleteRequest = async () => {
    setIsLoading(true);
    try {
      const isCompleted = await completeRequest(requestId, UserId);
      if (isCompleted) {
        toast.success("Request completed successfully.");
      }
      console.log("Attempting to complete request with ID:", requestId);
    } catch (error) {
      toast.error("Failed to complete request");
      console.error("Error completing request:", error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      {isLoading ? (
        <Button type="button" disabled>
          Loading <LoadingSpinner className="pl-2 w-4 h-4" />
        </Button>
      ) : (
        <Button onClick={CompleteRequest} type="button">
          Complete Request
        </Button>
      )}
    </>
  );
}
