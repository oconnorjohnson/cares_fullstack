import {
  getAdminWithRequestReceivedPreference,
  getAdminWithPostScreenPreference,
  getAdminWithReceiptUploadedPreference,
  getAdminWithAgreementUploadedPreference,
  getAdminWithRFFBalanceUpdatedPreference,
  getAdminWithCaresBalanceUpdatedPreference,
  getAdminWithRffAssetsAddedPreference,
  getAdminWithCaresAssetsAddedPreference,
  getAdminWithPickupEventScheduledPreference,
  getUserByUserId,
} from "@/server/supabase/functions/read";
import {
  sendRequestReceivedEmail,
  sendPostScreenCompletedEmail,
  sendReceiptUploadedEmail,
  sendAgreementUploadedEmail,
  sendRFFBalanceUpdatedEmail,
  sendCARESBalanceUpdatedEmail,
  sendRFFAssetsAddedEmail,
  sendCARESAssetsAddedEmail,
  sendPickupEventScheduledEmail,
} from "@/server/actions/email-events/admin/actions";
import { auth } from "@clerk/nextjs";

export async function sendNewRequestAdminEmails() {
  // const { userId: clerkuserId } = auth();
  // if (!clerkuserId) {
  //   throw new Error("User not authenticated");
  // }
  console.log("sending new request admin emails from admin.ts");
  const adminWithRequestReceivedPreference =
    await getAdminWithRequestReceivedPreference();
  console.log(
    "adminWithRequestReceivedPreference:",
    adminWithRequestReceivedPreference,
  );
  await Promise.all(
    adminWithRequestReceivedPreference.map(async (admin) => {
      try {
        const user = await getUserByUserId(admin.UserId!);
        const firstName = user?.first_name || "";
        const email = user?.email || "";
        console.log("email:", email);
        console.log("firstName:", firstName);
        await sendRequestReceivedEmail({
          email: email,
          firstName: firstName,
        });
      } catch (error) {
        console.error("Error sending new request admin email:", error);
      }
    }),
  );
}

export async function sendNewPostScreenAdminEmails() {
  // const { userId: clerkuserId } = auth();
  // if (!clerkuserId) {
  //   throw new Error("User not authenticated");
  // }
  const adminWithPostScreenPreference =
    await getAdminWithPostScreenPreference();
  await Promise.all(
    adminWithPostScreenPreference.map(async (admin) => {
      try {
        const user = await getUserByUserId(admin.UserId!);
        const firstName = user?.first_name || "";
        const email = user?.email || "";

        await sendPostScreenCompletedEmail({
          email: email,
          firstName: firstName,
        });
      } catch (error) {
        console.error("Error sending new post screen admin email:", error);
      }
    }),
  );
}

export async function sendReceiptUploadedAdminEmails() {
  // const { userId: clerkuserId } = auth();
  // if (!clerkuserId) {
  //   throw new Error("User not authenticated");
  // }
  const adminWithReceiptUploadedPreference =
    await getAdminWithReceiptUploadedPreference();
  await Promise.all(
    adminWithReceiptUploadedPreference.map(async (admin) => {
      try {
        const user = await getUserByUserId(admin.UserId!);
        const firstName = user?.first_name || "";
        const email = user?.email || "";

        await sendReceiptUploadedEmail({
          email: email,
          firstName: firstName,
        });
      } catch (error) {
        console.error("Error sending receipt uploaded admin email:", error);
      }
    }),
  );
}

export async function sendAgreementUploadedAdminEmails() {
  // const { userId: clerkuserId } = auth();
  // if (!clerkuserId) {
  //   throw new Error("User not authenticated");
  // }
  const adminWithAgreementUploadedPreference =
    await getAdminWithAgreementUploadedPreference();
  await Promise.all(
    adminWithAgreementUploadedPreference.map(async (admin) => {
      try {
        const user = await getUserByUserId(admin.UserId!);
        const firstName = user?.first_name || "";
        const email = user?.email || "";

        await sendAgreementUploadedEmail({
          email: email,
          firstName: firstName,
        });
      } catch (error) {
        console.error("Error sending agreement uploaded admin email:", error);
      }
    }),
  );
}

export async function sendRFFBalanceUpdatedAdminEmails() {
  // const { userId: clerkuserId } = auth();
  // if (!clerkuserId) {
  //   throw new Error("User not authenticated");
  // }
  const adminWithRFFBalanceUpdatedPreference =
    await getAdminWithRFFBalanceUpdatedPreference();
  await Promise.all(
    adminWithRFFBalanceUpdatedPreference.map(async (admin) => {
      try {
        const user = await getUserByUserId(admin.UserId!);
        const firstName = user?.first_name || "";
        const email = user?.email || "";

        await sendRFFBalanceUpdatedEmail({
          email: email,
          firstName: firstName,
        });
      } catch (error) {
        console.error("Error sending RFF balance updated admin email:", error);
      }
    }),
  );
}

export async function sendCARESBalanceUpdatedAdminEmails() {
  // const { userId: clerkuserId } = auth();
  // if (!clerkuserId) {
  //   throw new Error("User not authenticated");
  // }
  const adminWithCaresBalanceUpdatedPreference =
    await getAdminWithCaresBalanceUpdatedPreference();
  await Promise.all(
    adminWithCaresBalanceUpdatedPreference.map(async (admin) => {
      try {
        const user = await getUserByUserId(admin.UserId!);
        const firstName = user?.first_name || "";
        const email = user?.email || "";

        await sendCARESBalanceUpdatedEmail({
          email: email,
          firstName: firstName,
        });
      } catch (error) {
        console.error(
          "Error sending CARES balance updated admin email:",
          error,
        );
      }
    }),
  );
}

export async function sendRFFAssetsAddedAdminEmails() {
  // const { userId: clerkuserId } = auth();
  // if (!clerkuserId) {
  //   throw new Error("User not authenticated");
  // }
  const adminWithRffAssetsAddedPreference =
    await getAdminWithRffAssetsAddedPreference();
  await Promise.all(
    adminWithRffAssetsAddedPreference.map(async (admin) => {
      try {
        const user = await getUserByUserId(admin.UserId!);
        const firstName = user?.first_name || "";
        const email = user?.email || "";

        await sendRFFAssetsAddedEmail({
          email: email,
          firstName: firstName,
        });
      } catch (error) {
        console.error("Error sending RFF assets added admin email:", error);
      }
    }),
  );
}

export async function sendCARESAssetsAddedAdminEmails() {
  // const { userId: clerkuserId } = auth();
  // if (!clerkuserId) {
  //   throw new Error("User not authenticated");
  // }
  const adminWithCaresAssetsAddedPreference =
    await getAdminWithCaresAssetsAddedPreference();
  await Promise.all(
    adminWithCaresAssetsAddedPreference.map(async (admin) => {
      try {
        const user = await getUserByUserId(admin.UserId!);
        const firstName = user?.first_name || "";
        const email = user?.email || "";

        await sendCARESAssetsAddedEmail({
          email: email,
          firstName: firstName,
        });
      } catch (error) {
        console.error("Error sending CARES assets added admin email:", error);
      }
    }),
  );
}

export async function sendPickupEventScheduledAdminEmails() {
  // const { userId: clerkuserId } = auth();
  // if (!clerkuserId) {
  //   throw new Error("User not authenticated");
  // }
  console.log("sending pickup event scheduled admin emails from admin.ts");
  const adminWithPickupEventScheduledPreference =
    await getAdminWithPickupEventScheduledPreference();
  console.log(
    "adminWithPickupEventScheduledPreference:",
    adminWithPickupEventScheduledPreference,
  );
  await Promise.all(
    adminWithPickupEventScheduledPreference.map(async (admin) => {
      try {
        const user = await getUserByUserId(admin.UserId!);
        const firstName = user?.first_name || "";
        const email = user.email!;

        await sendPickupEventScheduledEmail({
          email: email,
          firstName: firstName,
        });
      } catch (error) {
        console.error(
          "Error sending pickup event scheduled admin email:",
          error,
        );
      }
    }),
  );
}
