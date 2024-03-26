"use client";
import { Button } from "@/components/ui/button";
import { XIcon } from "lucide-react";
import { DenyRequest } from "@/server/actions/update/actions";
import { useState } from "react";
import { toast } from "sonner";
import { cn } from "@/server/utils";
import { trpc } from "@/app/_trpc/client";
import { useUser } from "@clerk/nextjs";
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

export default function Deny({ requestId }: { requestId: number }) {
  const [isLoading, setIsLoading] = useState(false);
  const trpcContext = trpc.useContext(); // Adjusted to useContext based on standard tRPC hook usage

  // Use the new tRPC function to fetch user details by request ID
  const { data: userDetails, isLoading: isUserDetailsLoading } =
    trpc.getUserDetailsByRequestId.useQuery(requestId);

  const handleDeny = async () => {
    if (isUserDetailsLoading) {
      // Optionally handle the loading state here, e.g., by showing a loading indicator or disabling the button
      return;
    }

    setIsLoading(true);
    try {
      // Assuming DenyRequest takes requestId, firstName, and email as arguments
      await DenyRequest(
        requestId,
        userDetails?.first_name!,
        userDetails?.EmailAddress[0].email!,
      );
      toast.success("Request denied successfully.");
    } catch (error) {
      console.error("Error denying request:", error);
      toast.error("Error denying request.");
    } finally {
      setIsLoading(false);
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
