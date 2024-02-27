import { EmailTemplate } from "@/components/emails/banned";
import { Resend } from "resend";
import * as React from "react";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request, res: Response) {
  console.log("Content-Type:", req.headers.get("Content-Type")); // Debug log
  const rawBody = await req.text();
  console.log("Raw request body:", rawBody);

  if (!rawBody) {
    console.error("Empty request body");
    return new Response(JSON.stringify({ error: "Empty request body" }), {
      status: 400,
    });
  }
  try {
    const body = await req.json();
    const { firstName, email } = body;
    console.log("Parsed firstName:", firstName, email, body);

    const { data, error } = await resend.emails.send({
      from: "CARES <help@yolocountycares.com>",
      to: [email],
      subject: "You have been banned from submitting requests to CARES",
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
