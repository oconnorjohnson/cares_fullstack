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

export default function ReceiptDialog({ requestId }: { requestId: number }) {
  const {
    data: funds,
    isLoading,
    isError,
  } = trpc.getFundsThatNeedReceipts.useQuery(requestId);

  if (isLoading) return <p>Loading...</p>;
  if (isError || !funds) return <p>Error loading funds.</p>;
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
              <UploadButton
                endpoint="pdfUploader"
                onClientUploadComplete={(res) => {
                  console.log("Files: ", res);
                  toast.success(
                    "Upload Completed for " + fund.fundType.typeName,
                  );
                }}
                onUploadError={(error: Error) => {
                  toast.error(`ERROR! ${error.message}`);
                }}
              />
            </div>
          ))}
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}
