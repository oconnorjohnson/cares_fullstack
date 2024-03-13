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
import { useUser } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";
import { sendReceiptEmail } from "@/server/actions/update/actions";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

async function sendEmail(firstName: string, email: string) {
  await sendReceiptEmail(firstName, email);
  return true;
}
export default function ReceiptDialog({ requestId }: { requestId: number }) {
  console.log("requestId:", requestId);
  const {
    data: request,
    isLoading,
    isError,
  } = trpc.getRequest.useQuery(requestId);
  const TRPCContext = trpc.useUtils();
  const { user } = useUser();
  const email = user?.emailAddresses[0]?.emailAddress || "";
  const firstName = user?.firstName || "";

  if (isLoading) return <p>Loading...</p>;
  if (isError || !request) return <p>Error loading request.</p>;
  const handleUploadComplete = (requestId: number) => {
    toast.success("UploadCompleted");
    // sendEmail(firstName, email);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Upload Agreement</Button>
      </DialogTrigger>
      <DialogOverlay />
      <DialogPortal>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Agreement</DialogTitle>
            <DialogClose />
          </DialogHeader>
          {!request[0].agreementUrl ? (
            <div className="flex flex-row justify-between">
              <div>Agreement</div>
              <UploadButton
                endpoint="agreementUploader"
                input={{ requestId: requestId }}
                onClientUploadComplete={() => handleUploadComplete(requestId)}
              />
            </div>
          ) : (
            <div className="flex flex-row justify-between">
              <div>Agreement</div>
              <Button disabled>Uploaded</Button>
            </div>
          )}
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
