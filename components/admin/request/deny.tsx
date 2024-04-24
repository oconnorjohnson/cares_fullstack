"use client";
import { Button } from "@/components/ui/button";
import { XIcon } from "lucide-react";
import { DenyRequest } from "@/server/actions/update/actions";
import { useState } from "react";
import { toast } from "sonner";
import { cn } from "@/server/utils";
import { trpc } from "@/app/_trpc/client";
import { useUser } from "@clerk/nextjs";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export default function Deny({ requestId }: { requestId: number }) {
  const [isLoading, setIsLoading] = useState(false);
  const trpcContext = trpc.useContext(); // Adjusted to useContext based on standard tRPC hook usage

  // Use the new tRPC function to fetch user details by request ID
  const { data: userDetails, isLoading: isUserDetailsLoading } =
    trpc.getUserDetailsByRequestId.useQuery(requestId);

  const handleDeny = async () => {
    setIsLoading(true);
    console.log("Attempting to deny request with ID:", requestId);
    try {
      // Assuming DenyRequest takes requestId, firstName, and email as arguments
      await DenyRequest(
        requestId,
        userDetails?.first_name!,
        userDetails?.EmailAddress[0].email!,
      );
      console.log("Request denied successfully.");
      toast.success("Request denied successfully.");
    } catch (error) {
      console.error("Error denying request:", error);
      toast.error("Error denying request.");
    } finally {
      setIsLoading(false);
      console.log("Request denied successfully.");
      // Invalidate specific queries or all as needed
      trpcContext.invalidate();
    }
  };

  return (
    <Button
      onClick={handleDeny}
      variant="destructive"
      disabled={isUserDetailsLoading || isLoading}
    >
      {isLoading ? (
        <LoadingSpinner className={cn("w-4 h-4 text-white")} />
      ) : (
        <>
          Deny
          <div className="px-1" />
          <XIcon />
        </>
      )}
    </Button>
  );
}
