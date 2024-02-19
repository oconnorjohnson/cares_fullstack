import { EmailTemplate } from "@/components/emails/test";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST() {
  try {
    const data = await resend.emails.send({
      from: "Daniel <daniel@foreveryone.ai>",
      to: ["dajohnson@yolocounty.org"],
      text: "text",
      subject: "Hello world",
      react: EmailTemplate({ firstName: "John" }),
    });

    return Response.json(data);
  } catch (error) {
    return Response.json({ error });
  }
}
