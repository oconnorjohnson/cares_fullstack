import { currentUser } from "@clerk/nextjs";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createNewReceiptRecord } from "@/server/supabase/functions/create";
import { addAgreementToRequest } from "@/server/supabase/functions/update";
import {
  revalidateDashboard,
  revalidateUserRequests,
} from "@/server/actions/update/actions";
import {
  sendReceiptUploadedAdminEmails,
  sendAgreementUploadedAdminEmails,
} from "@/server/actions/email-events/admin";
const f = createUploadthing();

const auth = async () => {
  const user = await currentUser();
  return user;
};

const uploadInputSchema = z.object({
  fundId: z.number(),
  requestId: z.number(),
});
const uploadAgreementInputSchema = z.object({
  requestId: z.number(),
});

export const ourFileRouter = {
  agreementUploader: f({ pdf: { maxFileSize: "16MB", maxFileCount: 1 } })
    .input(uploadAgreementInputSchema)
    .middleware(async ({ files, input }) => {
      const user = await auth();
      if (!user) throw new Error("Unauthorized");
      const { requestId } = input;
      return { userId: user?.id, requestId };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Agreement upload complete for userId:", metadata.userId);
      revalidateDashboard();
      revalidateUserRequests();
      console.log("agreement file url", file.url);
      console.log("Request ID:", metadata.requestId);

      try {
        const addAgreement = await addAgreementToRequest(
          metadata.requestId,
          file.url,
        );
        console.log("Agreement added successfully:", addAgreement);
        revalidatePath("/user/requests");
        revalidatePath("/dashboard");
        await sendAgreementUploadedAdminEmails();
        return {
          uploadedBy: metadata.userId,
          agreementUrl: file.url,
          requestId: metadata.requestId,
        };
      } catch (error) {
        console.error("Error creating new agreement record:", error);
        throw error;
      }
    }),

  receiptUploader: f({ pdf: { maxFileSize: "16MB", maxFileCount: 1 } })
    .input(uploadInputSchema)
    .middleware(async ({ files, input }) => {
      const user = await auth();
      const uploadCount = files.length;
      if (!user) throw new Error("Unauthorized");
      const { fundId, requestId } = input;
      return { userId: user?.id, fundId, requestId };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for userId:", metadata.userId);
      revalidateDashboard();
      revalidateUserRequests();
      console.log("file url", file.url);
      console.log("FundID:", metadata.fundId);
      try {
        const newReceipt = await createNewReceiptRecord({
          userId: metadata.userId,
          fundId: metadata.fundId,
          requestId: metadata.requestId,
          url: file.url,
        });
        console.log("New receipt record created successfully:", newReceipt);
        await sendReceiptUploadedAdminEmails();
        return {
          uploadedBy: metadata.userId,
          fileUrl: file.url,
          fundId: metadata.fundId,
        };
      } catch (error) {
        console.error("Error creating new receipt record:", error);
      }
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
export const runtime = "nodejs";
