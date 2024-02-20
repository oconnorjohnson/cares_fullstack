"use client";
import SideNavBar from "@/components/user/dashboard/side-nav";
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";

export default function ClientsPage() {
  const user = useUser();
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
        }),
      });

      if (!response.ok) {
        // If the response is not OK, log the status and avoid parsing as JSON
        console.error("Failed to send email, status:", response.status);
        return;
      }

      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error("Failed to send email:", error);
    }
  };

  return (
    <div className="flex flex-row">
      <SideNavBar />
      <div className="flex border-t flex-col w-5/6">
        <div className="flex flex-row justify-between py-6"></div>
        <div className="text-3xl font-bold pl-12">My Clients</div>
        <Button onClick={handleSendEmail}>Call Route!</Button>

        <div className="py-12" />
      </div>
    </div>
  );
}
