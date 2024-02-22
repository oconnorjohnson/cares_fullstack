import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { createUser, updateUser, deleteUser } from "@/prisma/prismaFunctions";
import { sendWelcomeEmail } from "@/app/api/resend/welcome/route";

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

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error("WEBHOOK_SECRET not set.");
  }

  const headerPayload = headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error occured -- no svix headers", {
      status: 400,
    });
  }

  const payload = await req.json();
  const body = JSON.stringify(payload);

  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error occured", {
      status: 400,
    });
  }

  const { id } = evt.data;
  const eventType = evt.type;

  switch (eventType) {
    case "user.created": {
      const { id, email_addresses, first_name, last_name } =
        evt.data as unknown as UserData;
      const userData = {
        userId: id,
        first_name,
        last_name,
        emailAddresses: {
          create: email_addresses.map((emailAddress) => ({
            email: emailAddress.email_address,
          })),
        },
      };
      const user = await createUser(userData);
      console.log(`User ${user.id} created`);

      if (email_addresses.length > 0) {
        const primaryEmail = email_addresses[0].email_address;
        await sendWelcomeEmail(first_name, primaryEmail);
        console.log(`Welcome email sent to ${primaryEmail}`);
      }
      break;
    }
    case "user.updated": {
      const { id, first_name, last_name, email_addresses } =
        evt.data as UserData;
      const userData = {
        first_name,
        last_name,
        emailAddresses: email_addresses.map((emailAddress) => ({
          email: emailAddress.email_address,
          id: emailAddress.id,
        })),
      };
      const user = await updateUser(id, userData);
      console.log(`User ${user.id} updated`);
      break;
    }
    case "user.deleted": {
      const { id } = evt.data as unknown as UserData;
      await deleteUser(id);
      console.log(`User ${id} deleted`);
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
