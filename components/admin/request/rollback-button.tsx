"use client";
import { Button } from "@/components/ui/button";
import { rollbackRequestDenialByRequestId } from "@/server/supabase/functions/update";

export default function RollbackButton({ requestId }: { requestId: number }) {
  const handleRollback = async () => {
    const success = await rollbackRequestDenialByRequestId(requestId);
    if (success) {
      console.log("Request denied successfully.");
    } else {
      console.error("Failed to rollback request.");
    }
  };

  return <Button onClick={handleRollback}>Rollback</Button>;
}
