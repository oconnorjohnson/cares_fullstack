"use server";
import { Resend } from "resend";

import {
  RequestReceived as RecquestReceivedTemplate,
  PostScreenCompleted as PostScreenCompletedTemplate,
  ReceiptUploaded as ReceiptUploadedTemplate,
  AgreementUploaded as AgreementUploadedTemplate,
  RFFBalanceUpdated as RFFBalanceUpdatedTemplate,
  CARESBalanceUpdated as CARESBalanceUpdatedTemplate,
  RFFAssetsAdded as RFFAssetsAddedTemplate,
  CARESAssetsAdded as CARESAssetsAddedTemplate,
  PickupEventScheduled as PickupEventScheduledTemplate,
} from "@/components/emails/admin/emails";

export async function sendRequestReceivedEmail({
  email,
  firstName,
}: {
  email: string;
  firstName: string;
}) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  await resend.emails.send({
    from: "CARES <help@yolopublicdefendercares.org>",
    to: [email],
    subject: "Your request has been received!",
    react: RecquestReceivedTemplate({
      firstName: firstName,
    }) as React.ReactElement,
  });
}

export async function sendPostScreenCompletedEmail({
  email,
  firstName,
}: {
  email: string;
  firstName: string;
}) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  await resend.emails.send({
    from: "CARES <help@yolopublicdefendercares.org>",
    to: [email],
    subject: "Post-Screen Completed!",
    react: PostScreenCompletedTemplate({
      firstName: firstName,
    }) as React.ReactElement,
  });
}

export async function sendReceiptUploadedEmail({
  email,
  firstName,
}: {
  email: string;
  firstName: string;
}) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  await resend.emails.send({
    from: "CARES <help@yolopublicdefendercares.org>",
    to: [email],
    subject: "Receipt Uploaded!",
    react: ReceiptUploadedTemplate({
      firstName: firstName,
    }) as React.ReactElement,
  });
}

export async function sendAgreementUploadedEmail({
  email,
  firstName,
}: {
  email: string;
  firstName: string;
}) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  await resend.emails.send({
    from: "CARES <help@yolopublicdefendercares.org>",
    to: [email],
    subject: "Agreement Uploaded!",
    react: AgreementUploadedTemplate({
      firstName: firstName,
    }) as React.ReactElement,
  });
}

export async function sendRFFBalanceUpdatedEmail({
  email,
  firstName,
}: {
  email: string;
  firstName: string;
}) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  await resend.emails.send({
    from: "CARES <help@yolopublicdefendercares.org>",
    to: [email],
    subject: "RFF Balance Updated!",
    react: RFFBalanceUpdatedTemplate({
      firstName: firstName,
    }) as React.ReactElement,
  });
}

export async function sendCARESBalanceUpdatedEmail({
  email,
  firstName,
}: {
  email: string;
  firstName: string;
}) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  await resend.emails.send({
    from: "CARES <help@yolopublicdefendercares.org>",
    to: [email],
    subject: "CARES Balance Updated!",
    react: CARESBalanceUpdatedTemplate({
      firstName: firstName,
    }) as React.ReactElement,
  });
}

export async function sendRFFAssetsAddedEmail({
  email,
  firstName,
}: {
  email: string;
  firstName: string;
}) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  await resend.emails.send({
    from: "CARES <help@yolopublicdefendercares.org>",
    to: [email],
    subject: "RFF Assets Added!",
    react: RFFAssetsAddedTemplate({
      firstName: firstName,
    }) as React.ReactElement,
  });
}

export async function sendCARESAssetsAddedEmail({
  email,
  firstName,
}: {
  email: string;
  firstName: string;
}) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  await resend.emails.send({
    from: "CARES <help@yolopublicdefendercares.org>",
    to: [email],
    subject: "CARES Assets Added!",
    react: CARESAssetsAddedTemplate({
      firstName: firstName,
    }) as React.ReactElement,
  });
}

export async function sendPickupEventScheduledEmail({
  email,
  firstName,
}: {
  email: string;
  firstName: string;
}) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  await resend.emails.send({
    from: "CARES <help@yolopublicdefendercares.org>",
    to: [email],
    subject: "Pickup Event Scheduled!",
    react: PickupEventScheduledTemplate({
      firstName: firstName,
    }) as React.ReactElement,
  });
}
