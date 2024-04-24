"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { addAdminAgreementToRequest } from "@/server/actions/update/actions";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { CheckIcon } from "lucide-react";

export default function AgreeButton({
  userId,
  requestId,
}: {
  userId: string;
  requestId: number;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleAgree = async () => {
    setIsSubmitting(true);
    try {
      await addAdminAgreementToRequest({ userId, requestId });
    } catch (error) {
      console.error("Error adding admin agreement to request:", error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <>
      <Button
        onClick={handleAgree}
        variant="confirmation"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <LoadingSpinner className="w=4 h-4 text-white" />
        ) : (
          <>
            Agree
            <div className="px-1" />
            <CheckIcon className="h-4 w-4 text-white" />
          </>
        )}
      </Button>
    </>
  );
}
