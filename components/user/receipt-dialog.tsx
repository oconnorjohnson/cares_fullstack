"use client";
import {
  Dialog,
  DialogHeader,
  DialogTrigger,
  DialogContent,
  DialogFooter,
  DialogClose,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { UploadButton } from "@/server/uploadthing";
import { toast } from "sonner";
import { trpc } from "@/app/_trpc/client";
import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { sendReceiptEmail } from "@/server/actions/update/actions";

async function sendEmail(firstName: string, email: string) {
  await sendReceiptEmail(firstName, email);
  return true;
}
export default function ReceiptDialog({ requestId }: { requestId: number }) {
  const {
    data: funds,
    isLoading,
    isError,
  } = trpc.getFundsThatNeedReceipts.useQuery(requestId);
  const TRPCContext = trpc.useUtils();
  const { user } = useUser();
  const email = user?.emailAddresses[0]?.emailAddress || "";
  const firstName = user?.firstName || "";
  const [completedUploads, setCompletedUploads] = useState<number[]>([]);

  if (isLoading) return <p>Loading...</p>;
  if (isError || !funds) return <p>Error loading funds.</p>;
  const handleUploadComplete = (fundId: number) => {
    setCompletedUploads((prev) => [...prev, fundId]);
    toast.success("UploadCompleted");
    sendEmail(firstName, email);
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Upload Receipts</Button>
      </DialogTrigger>
      <DialogOverlay />
      <DialogPortal>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Receipts</DialogTitle>
            <DialogClose />
          </DialogHeader>
          {funds.data?.map((fund, index) => (
            <div
              className="flex flex-row justify-between"
              key={index}
              style={{ marginBottom: "10px" }}
            >
              <div>
                {fund.FundType?.typeName} - ${fund.amount}
              </div>
              {completedUploads.includes(fund.id) ? (
                <Button
                  disabled
                  style={{ pointerEvents: "none", opacity: 0.5 }}
                >
                  Uploaded
                </Button>
              ) : (
                <UploadButton
                  endpoint="receiptUploader"
                  input={{ fundId: fund.id, requestId: requestId }}
                  onClientUploadComplete={() => handleUploadComplete(fund.id)}
                />
              )}
            </div>
          ))}
        </DialogContent>
        <DialogFooter>
          <DialogClose>
            <Button>Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogPortal>
    </Dialog>
  );
}
