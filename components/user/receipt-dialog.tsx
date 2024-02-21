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
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Upload Receipts</Button>
      </DialogTrigger>
      <DialogOverlay />
      <DialogPortal>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Receipts, {requestId}</DialogTitle>
            <DialogClose />
          </DialogHeader>
          <UploadButton
            endpoint="pdfUploader"
            onClientUploadComplete={(res) => {
              // Do something with the response
              console.log("Files: ", res);
              toast.success("Upload Completed");
            }}
            onUploadError={(error: Error) => {
              // Do something with the error.
              toast.error(`ERROR! ${error.message}`);
            }}
          />
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}
