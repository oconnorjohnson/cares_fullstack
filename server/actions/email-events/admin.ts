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

export async function sendNewRequestAdminEmails() {
  const adminWithRequestReceivedPreference =
    await getAdminWithRequestReceivedPreference();
  await Promise.all(
    adminWithRequestReceivedPreference.map(async (admin) => {
      try {
        const user = await getUserByUserId(admin.UserId!);
        const firstName = user?.first_name || "";
        const email = user?.email || "";

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
        const email = user?.email || "";

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
