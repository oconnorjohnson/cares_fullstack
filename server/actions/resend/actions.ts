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
  console.log(`Banning user with email: ${email} and firstName: ${firstName}`); // Debug log

  if (!firstName || !email) {
    console.error("firstName or email is missing");
    return;
  }

  const requestBody = JSON.stringify({ firstName, email });
  console.log(`Request body: ${requestBody}`); // Debug log

  try {
    const response = await fetch(
      "https://yolocountycares.com/api/resend/banned",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: requestBody,
      },
    );

    if (!response.ok) {
      console.error("Failed to send email, status:", response.status);
      return;
    }

    const data = await response.json();
    console.log(`Response data: ${JSON.stringify(data)}`); // Debug log
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
