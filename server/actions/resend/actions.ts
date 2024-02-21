import { auth } from "@clerk/nextjs";

export async function Submitted() {
  const user = auth();
  const firstName = user?.user?.firstName;
  const email = user?.user?.emailAddresses[0].emailAddress;
  console.log(firstName, email);
  const handleSendEmail = async () => {
    try {
      const response = await fetch("/api/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName,
          email,
        }),
      });

      if (!response.ok) {
        console.error("Failed to send email, status:", response.status);
        return;
      }

      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error("Failed to send email:", error);
    }
  };
}
