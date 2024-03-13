import { currentUser } from "@clerk/nextjs";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { z } from "zod";

import { createNewReceiptRecord } from "@/server/supabase/functions/create";
import { addAgreementToRequest } from "@/server/supabase/functions/update";
import {
  revalidateDashboard,
  revalidateUserRequests,
} from "@/server/actions/update/actions";
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
// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  agreementUploader: f({ pdf: { maxFileSize: "16MB", maxFileCount: 1 } })
    .input(uploadAgreementInputSchema)
    .middleware(async ({ files, input }) => {
      // This code runs on your server before upload
      const user = await auth();
      // If you throw, the user will not be able to upload
      if (!user) throw new Error("Unauthorized");
      const { requestId } = input;
      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return { userId: user?.id, requestId };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
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
  // Define as many FileRoutes as you like, each with a unique routeSlug
  receiptUploader: f({ pdf: { maxFileSize: "16MB", maxFileCount: 1 } })
    // Set permissions and file types for this FileRoute
    .input(uploadInputSchema)
    .middleware(async ({ files, input }) => {
      // This code runs on your server before upload
      const user = await auth();
      const uploadCount = files.length;
      // If you throw, the user will not be able to upload
      if (!user) throw new Error("Unauthorized");
      const { fundId, requestId } = input;
      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return { userId: user?.id, fundId, requestId };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
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
