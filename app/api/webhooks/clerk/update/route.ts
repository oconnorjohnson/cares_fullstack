import { NextRequest, NextResponse } from "next/server";
import { WebhookEvent } from "@clerk/nextjs/server";
import { updateUser } from "@/lib/prismaFunctions";

interface EmailAddress {
  email_address: string;
  id: string;
}

interface UserData {
  id: string;
  first_name: string;
  last_name: string;
  email_addresses: EmailAddress[];
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const payload: WebhookEvent = await request.json();
    const { id, first_name, last_name, email_addresses } =
      payload.data as UserData;

    // Prepare the userData object with the correct structure
    const userData = {
      first_name,
      last_name,
      emailAddresses: email_addresses.map((emailAddress) => ({
        email: emailAddress.email_address,
        id: emailAddress.id,
      })),
    };

    // Call the updateUser function with the userId and userData
    const user = await updateUser(id, userData);

    console.log(`User ${user.id} updated`);
    return NextResponse.json(
      { message: `User ${user.id} updated` },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error handling webhook:", error);
    return NextResponse.json(
      { error: "Error handling webhook" },
      { status: 500 },
    );
  }
}
