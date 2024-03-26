"use client";
import { Button } from "@/components/ui/button";
import { CheckIcon } from "lucide-react";
// import { MarkPaid } from "@/server/actions/update/actions";
import MarkPaid from "@/server/actions/rff/paid";
import { useState } from "react";
import { trpc } from "@/app/_trpc/client";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Awaiting } from "@/server/actions/resend/actions";

export default function MarkAsPaid({
  requestId,
  firstName,
  email,
  UserId,
}: {
  requestId: number;
  firstName: string;
  email: string;
  UserId: string;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const trpcContext = trpc.useUtils();
  const handleMarkPaid = async () => {
    setIsLoading(true);
    try {
      await MarkPaid(requestId, UserId);
      // try {
      //   await Awaiting({ firstName, email });
      // } catch (error) {
      //   console.error("Failed to submit:", error);
      // }
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
