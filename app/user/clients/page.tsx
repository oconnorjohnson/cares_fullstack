"use client";
import { useCallback } from "react";
import SideNavBar from "@/components/user/dashboard/side-nav";
import { Button } from "@/components/ui/button";
import { EmailTemplate } from "@/components/emails/test";

export default function ClientsPage() {
  const handleSendEmail = async () => {
    try {
      const response = await fetch("/api/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
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
        <EmailTemplate firstName="Daniel" />
      </div>
    </div>
  );
}
