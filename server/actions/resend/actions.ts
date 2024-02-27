import { EmailTemplate as BannedEmailTemplate } from "@/components/emails/banned";
import { Resend } from "resend";
import ReactDOMServer from "react-dom/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function Approved({
  firstName,
  email,
}: {
  firstName: string;
  email: string;
}) {
  console.log(firstName, email);
  try {
    const response = await fetch(
      "https://yolocountycares.com/api/resend/approved",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName,
          email,
        }),
      },
    );

    if (!response.ok) {
      console.error("Failed to send email, status:", response.status);
      return;
    }

    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error("Failed to send email:", error);
  }
}

export async function Awaiting({
  firstName,
  email,
}: {
  firstName: string;
  email: string;
}) {
  console.log(firstName, email);
  try {
    const response = await fetch(
      "https://yolocountycares.com/api/resend/awaiting",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName,
          email,
        }),
      },
    );

    if (!response.ok) {
      console.error("Failed to send email, status:", response.status);
      return;
    }

    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error("Failed to send email:", error);
  }
}

export async function Banned({
  firstName,
  email,
}: {
  firstName: string;
  email: string;
}) {
  console.log(firstName, email);
  try {
    const response = await fetch(
      "https://yolocountycares.com/api/resend/banned",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName,
          email,
        }),
      },
    );

    if (!response.ok) {
      console.error("Failed to send email, status:", response.status);
      return;
    }

    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error("Failed to send email:", error);
  }
}

export async function Denied({
  firstName,
  email,
}: {
  firstName: string;
  email: string;
}) {
  console.log(firstName, email);
  try {
    const response = await fetch(
      "https://yolocountycares.com/api/resend/denied",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName,
          email,
        }),
      },
    );

    if (!response.ok) {
      console.error("Failed to send email, status:", response.status);
      return;
    }

    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error("Failed to send email:", error);
  }
}

export async function Late({
  firstName,
  email,
}: {
  firstName: string;
  email: string;
}) {
  console.log(firstName, email);
  try {
    const response = await fetch(
      "https://yolocountycares.com/api/resend/late",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName,
          email,
        }),
      },
    );

    if (!response.ok) {
      console.error("Failed to send email, status:", response.status);
      return;
    }

    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error("Failed to send email:", error);
  }
}

export async function Reminder({
  firstName,
  email,
}: {
  firstName: string;
  email: string;
}) {
  console.log(firstName, email);
  try {
    const response = await fetch(
      "https://yolocountycares.com/api/resend/reminder",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName,
          email,
        }),
      },
    );

    if (!response.ok) {
      console.error("Failed to send email, status:", response.status);
      return;
    }

    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error("Failed to send email:", error);
  }
}

export async function Submitted({
  firstName,
  email,
}: {
  firstName: string;
  email: string;
}) {
  console.log(firstName, email);
  try {
    const response = await fetch(
      "https://yolocountycares.com/api/resend/submitted",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName,
          email,
        }),
      },
    );

    if (!response.ok) {
      console.error("Failed to send email, status:", response.status);
      return;
    }

    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error("Failed to send email:", error);
  }
}
