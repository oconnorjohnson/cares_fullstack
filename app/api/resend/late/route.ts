import { EmailTemplate } from "@/components/emails/test";
import { Resend } from "resend";
import * as React from "react";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request, res: Response) {
  console.log("Received request to /api/send");

  try {
    const body = await req.json();
    const { firstName } = body;
    console.log("Parsed firstName:", firstName, body);

    const { data, error } = await resend.emails.send({
      from: "CARES <onboarding@resend.dev>",
      to: ["admin@foreveryone.ai"],
      subject: "Testing, testing...1-2-3, 1-2-3...",
      react: EmailTemplate({
        firstName: firstName,
      }) as React.ReactElement,
    });

    if (error) {
      console.log("Error from Resend API:", error);
      return new Response(JSON.stringify({ error }), { status: 400 });
    }

    console.log("Success response from Resend API:", data);
    return new Response(JSON.stringify({ data }), { status: 200 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Exception caught in /api/send:", error.message);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
      });
    } else {
      console.error("Non-error object thrown:", error);
      return new Response(
        JSON.stringify({ error: "An unknown error occurred" }),
        { status: 500 },
      );
    }
  }
}
