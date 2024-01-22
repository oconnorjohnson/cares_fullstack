import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { WebhookEvent } from "@clerk/nextjs/server";

const prisma = new PrismaClient();

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
  
      const { id, email_addresses, first_name, last_name } = payload.data as unknown as UserData;
  
      const user = await prisma.user.create({
        data: {
          userId: id,
          first_name,
          last_name,
          emailAddresses: {
            create: email_addresses.map((emailAddress) => ({
              email: emailAddress.email_address
            })),
          },
        },
      });
  
      console.log(`User ${user.id} created`);
  
      return NextResponse.json({ message: `User ${user.id} created`}, { status: 200 });
    } catch (error) { 
      console.error("Error handling webhook:", error);
      return NextResponse.json({ error: "Error handling webhook" }, { status: 500 });
    }
  }