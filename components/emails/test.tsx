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

const button = {
  backgroundColor: "#007ee6",
  borderRadius: "25px",
  color: "#fff",
  fontFamily: "'Open Sans', 'Helvetica Neue', Arial",
  fontSize: "15px",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  width: "210px",
  padding: "14px 7px",
};

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  firstName,
}) => (
  <Html lang="en">
    <Head />
    <Preview>This is a test email.</Preview>
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
      <Body className="">
        <Container className="">
          <Section className="bg-zinc-200 rounded-2xl px-12 py-8">
            <Text className="text-3xl font-bold">Hi {firstName},</Text>
            <Text className="text-lg">
              Welcome to the Yolo County Public Defender CARES program! We are
              excited to work with you to help you get back on your feet. Please
              click the button below to get started.
            </Text>
            <Button
              className="bg-orange-500 p-4 rounded-xl text-white text-xl font-bold"
              href="https://yolopublicdefendercares.org"
            >
              Get Started
            </Button>
          </Section>
        </Container>
      </Body>
    </Tailwind>
  </Html>
);
