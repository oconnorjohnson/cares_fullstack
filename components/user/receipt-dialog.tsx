"use client";
import {
  Dialog,
  DialogHeader,
  DialogTrigger,
  DialogContent,
  DialogFooter,
  DialogClose,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { UploadButton } from "@/server/uploadthing";
import { toast } from "sonner";
import { trpc } from "@/app/_trpc/client";
import { useState } from "react";
import { revalidatePath } from "next/cache";

export default function ReceiptDialog({ requestId }: { requestId: number }) {
  const {
    data: funds,
    isLoading,
    isError,
  } = trpc.getFundsThatNeedReceipts.useQuery(requestId);
  const TRPCContext = trpc.useUtils();
  const [completedUploads, setCompletedUploads] = useState<number[]>([]);
  if (isLoading) return <p>Loading...</p>;
  if (isError || !funds) return <p>Error loading funds.</p>;
  const handleUploadComplete = (fundId: number) => {
    setCompletedUploads((prev) => [...prev, fundId]);
    toast.success("UploadCompleted");
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
          {funds.map((fund, index) => (
            <div
              className="flex flex-row justify-between"
              key={index}
              style={{ marginBottom: "10px" }}
            >
              <div>
                {fund.fundType.typeName} - ${fund.amount}
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
                  endpoint="pdfUploader"
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
