import { Resend } from "resend";
import {
  RequestReceived,
  PostScreenCompleted,
  ReceiptUploaded,
  AgreementUploaded,
  RFFBalanceUpdated,
  CARESBalanceUpdated,
  RFFAssetsAdded,
  CARESAssetsAdded,
} from "@/components/emails/admin/emails";

export async function requestReceivedEmail(
  firstName: string,
  email: string,
): Promise<boolean> {
  const resend = new Resend(process.env.RESEND_API_KEY);
  await resend.emails.send({
    from: "CARES <help@yolocountycares.com>",
    to: [email],
    subject: "A new request has been received!",
    react: RequestReceived({
      firstName: firstName,
    }) as React.ReactElement,
  });
  return true;
}

export async function postScreenCompletedEmail(
  firstName: string,
  email: string,
): Promise<boolean> {
  const resend = new Resend(process.env.RESEND_API_KEY);
  await resend.emails.send({
    from: "CARES <help@yolocountycares.com>",
    to: [email],
    subject: "Post-Screen Completed!",
    react: PostScreenCompleted({
      firstName: firstName,
    }) as React.ReactElement,
  });
  return true;
}

export async function receiptUploadedEmail(
  firstName: string,
  email: string,
): Promise<boolean> {
  const resend = new Resend(process.env.RESEND_API_KEY);
  await resend.emails.send({
    from: "CARES <help@yolocountycares.com>",
    to: [email],
    subject: "Receipt Uploaded!",
    react: ReceiptUploaded({
      firstName: firstName,
    }) as React.ReactElement,
  });
  return true;
}

export async function agreementUploadedEmail(
  firstName: string,
  email: string,
): Promise<boolean> {
  const resend = new Resend(process.env.RESEND_API_KEY);
  await resend.emails.send({
    from: "CARES <help@yolocountycares.com>",
    to: [email],
    subject: "Agreement Uploaded!",
    react: AgreementUploaded({
      firstName: firstName,
    }) as React.ReactElement,
  });
  return true;
}

export async function rffBalanceUpdatedEmail(
  firstName: string,
  email: string,
): Promise<boolean> {
  const resend = new Resend(process.env.RESEND_API_KEY);
  await resend.emails.send({
    from: "CARES <help@yolocountycares.com>",
    to: [email],
    subject: "RFF Balance Updated!",
    react: RFFBalanceUpdated({
      firstName: firstName,
    }) as React.ReactElement,
  });
  return true;
}

export async function caresBalanceUpdatedEmail(
  firstName: string,
  email: string,
): Promise<boolean> {
  const resend = new Resend(process.env.RESEND_API_KEY);
  await resend.emails.send({
    from: "CARES <help@yolocountycares.com>",
    to: [email],
    subject: "CARES Balance Updated!",
    react: CARESBalanceUpdated({
      firstName: firstName,
    }) as React.ReactElement,
  });
  return true;
}

export async function rffAssetsAddedEmail(
  firstName: string,
  email: string,
): Promise<boolean> {
  const resend = new Resend(process.env.RESEND_API_KEY);
  await resend.emails.send({
    from: "CARES <help@yolocountycares.com>",
    to: [email],
    subject: "RFF Assets Added!",
    react: RFFAssetsAdded({
      firstName: firstName,
    }) as React.ReactElement,
  });
  return true;
}

export async function caresAssetsAddedEmail(
  firstName: string,
  email: string,
): Promise<boolean> {
  const resend = new Resend(process.env.RESEND_API_KEY);
  await resend.emails.send({
    from: "CARES <help@yolocountycares.com>",
    to: [email],
    subject: "CARES Assets Added!",
    react: CARESAssetsAdded({
      firstName: firstName,
    }) as React.ReactElement,
  });
  return true;
}
