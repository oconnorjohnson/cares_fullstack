import { EmailTemplate } from "@/components/emails/test";
import { Resend } from "resend";
import * as React from "react";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST() {
  try {
    const { data, error } = await resend.emails.send({
      from: "CARES <onboarding@resend.dev>",
      to: ["admin@foreveryone.ai"],
      subject: "Testing, testing...1-2-3, 1-2-3...",
      react: EmailTemplate({ firstName: "Daniel" }) as React.ReactElement,
    });

    if (error) {
      return Response.json({ error });
    }

    return Response.json({ data });
  } catch (error) {
    return Response.json({ error });
  }
}
