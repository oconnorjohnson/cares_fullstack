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
    <Preview>Your request has been denied.</Preview>
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
            <Text className="text-3xl font-bold">Hi {firstName},</Text>
            <Text className="text-lg">
              Unfortunately, we could not approve your request at this time. If
              you have any questions, please reach out to us at{" "}
              <Link href="mailto:info@yolopublicdefendercares.org">
                info@yolopublicdefendercares.org
              </Link>
              .
            </Text>
          </Section>
        </Container>
      </Body>
    </Tailwind>
  </Html>
);
