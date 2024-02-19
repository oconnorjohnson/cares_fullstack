import { Resend } from "resend";
import { EmailTemplate } from "@/components/emails/test";

const resendApiKey = process.env.RESEND_API_KEY;
if (!resendApiKey) {
  throw new Error("RESEND_API_KEY NOT SET!");
}

const resend = new Resend(resendApiKey);

export async function sendTestEmail() {
  try {
    await resend.emails.send({
      from: "daniel@foreveryone.ai",
      to: "dajohnson@yolocounty.org",
      subject: "Test",
      react: EmailTemplate({ firstName: "Daniel" }),
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
}
