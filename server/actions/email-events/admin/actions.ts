"use server";
import { Resend } from "resend";

import {
  RequestReceived as RequestReceivedTemplate,
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
    subject: "A new request has been received!",
    react: RequestReceivedTemplate({
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
    subject: "A new post-screen form has been completed!",
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
    subject: "A new receipt has been uploaded!",
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
    subject: "A new agreement has been uploaded!",
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
    subject: "The RFF balance has been updated!",
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
    subject: "The CARES balance has been updated!",
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
    subject: "New RFF assets have been added!",
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
    subject: "New CARES assets have been added!",
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
    subject: "A new pickup event has been scheduled!",
    react: PickupEventScheduledTemplate({
      firstName: firstName,
    }) as React.ReactElement,
  });
}
