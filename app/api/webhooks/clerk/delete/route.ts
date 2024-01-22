import { NextRequest, NextResponse } from "next/server";
import { WebhookEvent } from "@clerk/nextjs/server";
import { deleteUser } from "@/lib/prismaFunctions";

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

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const payload: WebhookEvent = await request.json();
    const { id } = payload.data as unknown as UserData;

    await deleteUser(id);

    console.log(`User ${id} deleted`);
    return NextResponse.json(
      { message: `User ${id} deleted` },
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
