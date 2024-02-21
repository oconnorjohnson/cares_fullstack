"use client";
import { Button } from "@/components/ui/button";
import { XIcon } from "lucide-react";
import { DenyRequest } from "@/server/actions/update/actions";
import { useState } from "react";
import { toast } from "sonner";
import { cn } from "@/server/utils";
import { trpc } from "@/app/_trpc/client";
import { Denied } from "@/server/actions/resend/actions";
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
  const trpcContext = trpc.useUtils();
  const { user } = useUser();
  const email = user?.emailAddresses[0]?.emailAddress || "";
  const firstName = user?.firstName || "";
  const handleDeny = async () => {
    setIsLoading(true);
    try {
      await DenyRequest(requestId);
      toast.success("Request denied successfully.");
      try {
        await Denied({ firstName, email });
      } catch (error) {
        console.error("Failed to submit:", error);
      }
    } catch (error) {
      console.error("Error approving request:", error);
      toast.error("Error denying request successfully.");
    } finally {
      setIsLoading(false);
      trpcContext.invalidate();
    }
  };

  return (
    <Button onClick={handleDeny} variant="destructive">
      {isLoading ? (
        <LoadingSpinner className="w-4 h-4 text-white" />
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
