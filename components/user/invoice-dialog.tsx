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
import { useState } from "react";
import { useUser } from "@clerk/nextjs";
// import { sendReceiptEmail } from "@/server/actions/update/actions";

// async function sendEmail(firstName: string, email: string) {
//     await sendReceiptEmail(firstName, email);
//     return true;
// }

export default function ReceiptDialog({ requestId }: { requestId: number }) {
  const { user } = useUser();
  const email = user?.emailAddresses[0]?.emailAddress || "";
  const firstName = user?.firstName || "";
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleUploadComplete = (requestId: number) => {
    setIsSubmitting(true);
    try {
      // submit functionality
    } catch (error) {
      console.error("Error submitting form:", error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Upload Invoice</Button>
      </DialogTrigger>
      <DialogOverlay />
      <DialogPortal>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Invoice</DialogTitle>
            <div className="flex flex-row justify-between">
              <div>Upload Invoice</div>
              <UploadButton
                endpoint="invoiceUploader"
                input={{ requestId: requestId }}
                onClientUploadComplete={() => handleUploadComplete(requestId)}
              />
            </div>
          </DialogHeader>
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
