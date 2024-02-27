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

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  firstName,
}) => (
  <Html lang="en">
    <Preview>Welcome!</Preview>
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
              Welcome to CARES&apos;s support program. When you login to the
              dashboard via the button below, you can add a client and then
              submit a request on their behalf. If you have any questions,
              please reach out to us at{" "}
              <Link href="mailto:help@yolopublicdefendercares.org">
                help@yolopublicdefendercares.org
              </Link>
              .
            </Text>
            <Button
              className="bg-orange-500 p-4 rounded-xl text-white dark:text-white text-xl font-bold"
              href="https://yolopublicdefendercares.org/dashboard"
            >
              Go to Dashboard
            </Button>
          </Section>
        </Container>
      </Body>
    </Tailwind>
  </Html>
);
