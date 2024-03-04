"use client";
import { Button } from "@/components/ui/button";
import { CheckIcon } from "lucide-react";
import { MarkPaid } from "@/server/actions/update/actions";
import { useState } from "react";
import { trpc } from "@/app/_trpc/client";
import { LoadingSpinner } from "@/components/admin/request/deny";
import { Awaiting } from "@/server/actions/resend/actions";
import { useUser } from "@clerk/nextjs";

export default function MarkAsPaid({ requestId }: { requestId: number }) {
  const [isLoading, setIsLoading] = useState(false);
  const trpcContext = trpc.useUtils();
  const { user } = useUser();
  const email = user?.emailAddresses[0]?.emailAddress || "";
  const firstName = user?.firstName || "";
  const handleMarkPaid = async () => {
    setIsLoading(true);
    try {
      await MarkPaid(requestId, firstName, email);
      try {
        await Awaiting({ firstName, email });
      } catch (error) {
        console.error("Failed to submit:", error);
      }
    } catch (error) {
      console.error("Error marking request as paid:", error);
    } finally {
      setIsLoading(false);
      trpcContext.invalidate();
    }
  };

  return (
    <Button onClick={handleMarkPaid} variant="confirmation">
      {isLoading ? (
        <LoadingSpinner className="w-4 h-4 text-white" />
      ) : (
        <>
          Mark Paid
          <div className="px-1" />
          <CheckIcon />
        </>
      )}
    </Button>
  );
}
