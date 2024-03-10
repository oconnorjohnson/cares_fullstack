import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import {
  createUser,
  createEmailAddresses,
} from "@/server/supabase/functions/create";
import { updateUser } from "@/server/supabase/functions/update";
import { deleteUser } from "@/server/supabase/functions/delete";
import { EmailTemplate } from "@/components/emails/welcome";
import { Resend } from "resend";
import { Tables } from "@/types_db";

interface EmailAddress {
  email_address: string;
  id: string;
}

interface UserData {
  id: string;
  email_addresses: EmailAddress[];
  first_name: string;
  last_name: string;
}
const resend = new Resend(process.env.RESEND_API_KEY);
async function sendWelcomeEmail(firstName: string, email: string) {
  console.log(`Attempting to send welcome email to ${email}`);
  const { data, error } = await resend.emails.send({
    from: "CARES <info@yolopublicdefendercares.org>",
    to: [email],
    subject: "Welcome!",
    react: EmailTemplate({
      firstName: firstName,
    }) as React.ReactElement,
  });

  if (error) {
    console.error("Error from Resend API:", error);
    throw new Error(`Error sending welcome email: ${error}`);
  }

  console.log("Success response from Resend API:", data);
  return data;
}

export async function POST(req: Request) {
  console.log("Starting POST function");
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    console.error("WEBHOOK_SECRET not set.");
    throw new Error("WEBHOOK_SECRET not set.");
  }
  console.log("Extracting headers");
  const headerPayload = headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");
  console.log(
    `Received svix_id: ${svix_id}, svix_timestamp: ${svix_timestamp}, svix_signature: ${svix_signature}`,
  );
  if (!svix_id || !svix_timestamp || !svix_signature) {
    console.error("Error occurred -- no svix headers");
    return new Response("Error occured -- no svix headers", {
      status: 400,
    });
  }

  const payload = await req.json();
  const body = JSON.stringify(payload);
  console.log("Payload received:", payload);
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  try {
    console.log("Verifying webhook");
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
    console.log("Webhook verified successfully");
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error occured", {
      status: 400,
    });
  }

  const { id } = evt.data;
  const eventType = evt.type;
  console.log(`Processing event type: ${eventType} with ID: ${id}`);

  switch (eventType) {
    case "user.created": {
      console.log("User creation event detected");
      const { id, email_addresses, first_name, last_name } =
        evt.data as unknown as UserData;
      console.log(
        `User details: ID=${id}, First Name=${first_name}, Last Name=${last_name}, Email Addresses=${email_addresses.length}`,
      );
      const userData = {
        userId: id,
        first_name,
        last_name,
      };
      const emailData = email_addresses.map((emailAddress) => ({
        userId: id,
        email: emailAddress.email_address,
      }));
      console.log("Creating user in database");
      const user = await createUser(userData);
      console.log(`User ${user} created successfully`);
      const createdUser = await createUser(userData);
      if (createdUser) {
        await createEmailAddresses(emailData);
      }
      if (email_addresses.length > 0) {
        const primaryEmail = email_addresses[0].email_address;
        await sendWelcomeEmail(first_name, primaryEmail);
        console.log(`Welcome email sent to ${primaryEmail}`);
      }
      break;
    }
    case "user.updated": {
      console.log("User update event detected");
      const { id, first_name, last_name, email_addresses } =
        evt.data as UserData;
      console.log(`Updating user: ID=${id}`);
      const userData = {
        userId: id,
        first_name,
        last_name,
        emailAddresses: email_addresses.map((emailAddress) => ({
          email: emailAddress.email_address,
          id: emailAddress.id,
        })),
      };
      console.log("Updating user in database with new details");
      const user = await updateUser(id, userData);
      console.log(`User ${user} updated`);
      break;
    }
    case "user.deleted": {
      console.log("User deletion event detected");
      const { id } = evt.data as unknown as UserData;
      console.log(`Deleting user: ID=${id}`);
      await deleteUser(id);
      console.log(`User ${id} deleted successfully`);
      break;
    }
    default: {
      console.log(`Unhandled event type: ${eventType}`);
    }
  }

  console.log(`Webhook with and ID of ${id} and type of ${eventType}`);
  console.log("Webhook body:", body);

  return new Response("", { status: 200 });
}
