import * as React from "react";
import {
  Body,
  Tailwind,
  Button,
  Container,
  Head,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface EmailTemplateProps {
  firstName: string;
}

export const RequestReceived: React.FC<Readonly<EmailTemplateProps>> = ({
  firstName,
}) => (
  <Html lang="en">
    <Preview>Request Approved!</Preview>
    <Tailwind
      config={{
        theme: {
          extend: {
            colors: {
              brand: "#007291",
            },
          },
        },
      }}
    >
      <Head />
      <Body className="">
        <Container className="">
          <Section className="bg-zinc-200 rounded-2xl px-12 py-8">
            {/* <Img src="logo.png" alt="Cares Logo" width="40" height="33" /> */}
            <Text className="text-3xl font-bold">Hi {firstName},</Text>
            <Text className="text-lg">
              A new request has been received! Head over to the{" "}
              <Link href="https://yolopublicdefendercares.org/dashboard">
                dashboard
              </Link>{" "}
              to review and approve.
            </Text>
            <Button
              className="bg-orange-500 p-4 rounded-xl text-white text-xl font-bold"
              href="https://yolopublicdefendercares.org/admin/requests"
            >
              View Requests
            </Button>
          </Section>
        </Container>
      </Body>
    </Tailwind>
  </Html>
);

export const PostScreenCompleted: React.FC<Readonly<EmailTemplateProps>> = ({
  firstName,
}) => (
  <Html lang="en">
    <Preview>Post-Screen Completed!</Preview>
    <Tailwind
      config={{
        theme: {
          extend: {
            colors: {
              brand: "#007291",
            },
          },
        },
      }}
    >
      <Head />
      <Body className="">
        <Container className="">
          <Section className="bg-zinc-200 rounded-2xl px-12 py-8">
            {/* <Img src="logo.png" alt="Cares Logo" width="40" height="33" /> */}
            <Text className="text-3xl font-bold">Hi {firstName},</Text>
            <Text className="text-lg">
              A new post-screen form has been completed! Head over to the{" "}
              <Link href="https://yolopublicdefendercares.org/dashboard">
                dashboard
              </Link>{" "}
              to review.
            </Text>
            <Button
              className="bg-orange-500 p-4 rounded-xl text-white text-xl font-bold"
              href="https://yolopublicdefendercares.org/admin/requests"
            >
              View Requests
            </Button>
          </Section>
        </Container>
      </Body>
    </Tailwind>
  </Html>
);

export const ReceiptUploaded: React.FC<Readonly<EmailTemplateProps>> = ({
  firstName,
}) => (
  <Html lang="en">
    <Preview>Receipt Uploaded!</Preview>
    <Tailwind
      config={{
        theme: {
          extend: {
            colors: {
              brand: "#007291",
            },
          },
        },
      }}
    >
      <Head />
      <Body className="">
        <Container className="">
          <Section className="bg-zinc-200 rounded-2xl px-12 py-8">
            {/* <Img src="logo.png" alt="Cares Logo" width="40" height="33" /> */}
            <Text className="text-3xl font-bold">Hi {firstName},</Text>
            <Text className="text-lg">
              A new receipt has been uploaded! Head over to the{" "}
              <Link href="https://yolopublicdefendercares.org/dashboard">
                dashboard
              </Link>{" "}
              to review.
            </Text>
            <Button
              className="bg-orange-500 p-4 rounded-xl text-white text-xl font-bold"
              href="https://yolopublicdefendercares.org/admin/requests"
            >
              View Requests
            </Button>
          </Section>
        </Container>
      </Body>
    </Tailwind>
  </Html>
);

export const AgreementUploaded: React.FC<Readonly<EmailTemplateProps>> = ({
  firstName,
}) => (
  <Html lang="en">
    <Preview>Agreement Uploaded!</Preview>
    <Tailwind
      config={{
        theme: {
          extend: {
            colors: {
              brand: "#007291",
            },
          },
        },
      }}
    >
      <Head />
      <Body className="">
        <Container className="">
          <Section className="bg-zinc-200 rounded-2xl px-12 py-8">
            {/* <Img src="logo.png" alt="Cares Logo" width="40" height="33" /> */}
            <Text className="text-3xl font-bold">Hi {firstName},</Text>
            <Text className="text-lg">
              A new agreement has been received! Head over to the{" "}
              <Link href="https://yolopublicdefendercares.org/dashboard">
                dashboard
              </Link>{" "}
              to review.
            </Text>
            <Button
              className="bg-orange-500 p-4 rounded-xl text-white text-xl font-bold"
              href="https://yolopublicdefendercares.org/admin/requests"
            >
              View Requests
            </Button>
          </Section>
        </Container>
      </Body>
    </Tailwind>
  </Html>
);

export const RFFBalanceUpdated: React.FC<Readonly<EmailTemplateProps>> = ({
  firstName,
}) => (
  <Html lang="en">
    <Preview>RFF Balance Updated!</Preview>
    <Tailwind
      config={{
        theme: {
          extend: {
            colors: {
              brand: "#007291",
            },
          },
        },
      }}
    >
      <Head />
      <Body className="">
        <Container className="">
          <Section className="bg-zinc-200 rounded-2xl px-12 py-8">
            {/* <Img src="logo.png" alt="Cares Logo" width="40" height="33" /> */}
            <Text className="text-3xl font-bold">Hi {firstName},</Text>
            <Text className="text-lg">
              The RFF balance has been updated! Head over to the{" "}
              <Link href="https://yolopublicdefendercares.org/dashboard">
                dashboard
              </Link>{" "}
              to review.
            </Text>
            <Button
              className="bg-orange-500 p-4 rounded-xl text-white text-xl font-bold"
              href="https://yolopublicdefendercares.org/admin/finances"
            >
              View Finances
            </Button>
          </Section>
        </Container>
      </Body>
    </Tailwind>
  </Html>
);

export const CARESBalanceUpdated: React.FC<Readonly<EmailTemplateProps>> = ({
  firstName,
}) => (
  <Html lang="en">
    <Preview>CARES Balance Updated!</Preview>
    <Tailwind
      config={{
        theme: {
          extend: {
            colors: {
              brand: "#007291",
            },
          },
        },
      }}
    >
      <Head />
      <Body className="">
        <Container className="">
          <Section className="bg-zinc-200 rounded-2xl px-12 py-8">
            {/* <Img src="logo.png" alt="Cares Logo" width="40" height="33" /> */}
            <Text className="text-3xl font-bold">Hi {firstName},</Text>
            <Text className="text-lg">
              The CARES balance has been updated! Head over to the{" "}
              <Link href="https://yolopublicdefendercares.org/dashboard">
                dashboard
              </Link>{" "}
              to review.
            </Text>
            <Button
              className="bg-orange-500 p-4 rounded-xl text-white text-xl font-bold"
              href="https://yolopublicdefendercares.org/admin/finances"
            >
              View Finances
            </Button>
          </Section>
        </Container>
      </Body>
    </Tailwind>
  </Html>
);

export const RFFAssetsAdded: React.FC<Readonly<EmailTemplateProps>> = ({
  firstName,
}) => (
  <Html lang="en">
    <Preview>RFF Assets added!</Preview>
    <Tailwind
      config={{
        theme: {
          extend: {
            colors: {
              brand: "#007291",
            },
          },
        },
      }}
    >
      <Head />
      <Body className="">
        <Container className="">
          <Section className="bg-zinc-200 rounded-2xl px-12 py-8">
            {/* <Img src="logo.png" alt="Cares Logo" width="40" height="33" /> */}
            <Text className="text-3xl font-bold">Hi {firstName},</Text>
            <Text className="text-lg">
              RFF assets have been added! Head over to the{" "}
              <Link href="https://yolopublicdefendercares.org/dashboard">
                dashboard
              </Link>{" "}
              to review.
            </Text>
            <Button
              className="bg-orange-500 p-4 rounded-xl text-white text-xl font-bold"
              href="https://yolopublicdefendercares.org/admin/assets"
            >
              View Assets
            </Button>
          </Section>
        </Container>
      </Body>
    </Tailwind>
  </Html>
);

export const CARESAssetsAdded: React.FC<Readonly<EmailTemplateProps>> = ({
  firstName,
}) => (
  <Html lang="en">
    <Preview>CARES Assets Added!</Preview>
    <Tailwind
      config={{
        theme: {
          extend: {
            colors: {
              brand: "#007291",
            },
          },
        },
      }}
    >
      <Head />
      <Body className="">
        <Container className="">
          <Section className="bg-zinc-200 rounded-2xl px-12 py-8">
            {/* <Img src="logo.png" alt="Cares Logo" width="40" height="33" /> */}
            <Text className="text-3xl font-bold">Hi {firstName},</Text>
            <Text className="text-lg">
              CARES assets have been added! Head over to the{" "}
              <Link href="https://yolopublicdefendercares.org/dashboard">
                dashboard
              </Link>{" "}
              to review.
            </Text>
            <Button
              className="bg-orange-500 p-4 rounded-xl text-white text-xl font-bold"
              href="https://yolopublicdefendercares.org/admin/assets"
            >
              View Assets
            </Button>
          </Section>
        </Container>
      </Body>
    </Tailwind>
  </Html>
);
