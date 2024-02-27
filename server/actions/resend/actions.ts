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
  console.log("Starting Banned function"); // Initial log statement

  try {
    if (!firstName || !email) {
      console.error("firstName or email is missing");
      return;
    }

    const requestBody = JSON.stringify({ firstName, email });
    console.log(`Request body: ${requestBody}`);

    console.log("About to make fetch call"); // Log before fetch
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
    console.log("Fetch call made"); // Log after fetch

    if (!response.ok) {
      console.error(`Failed to send email, status: ${response.status}`);
      return;
    }

    const data = await response.json();
    console.log(`Response data: ${JSON.stringify(data)}`);
  } catch (error) {
    console.error("Error in Banned function:", error);
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
