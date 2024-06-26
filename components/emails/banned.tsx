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
    <Preview>Your account has been banned.</Preview>
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
              You have been banned from submitting future requests to CARES. If
              you have any questions, please reach out to us at{" "}
              <Link href="mailto:info@yolopublicdefendercares.org">
                info@yolopublicdefendercares.org
              </Link>
              .
            </Text>
            <Button
              className="bg-orange-500 p-4 rounded-xl text-white text-xl font-bold"
              href="mailto:info@yolopublicdefendercares.org"
            >
              Reach out to us
            </Button>
          </Section>
        </Container>
      </Body>
    </Tailwind>
  </Html>
);
