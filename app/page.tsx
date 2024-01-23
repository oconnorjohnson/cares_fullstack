"use client";
import {
  SignedIn,
  SignedOut,
  UserButton,
  SignInButton,
  SignUpButton,
} from "@clerk/nextjs";
import { ModeToggle } from "@/components/mode-toggle";

export default function Home() {
  return (
    <>
      <main>
        <ModeToggle />
        <SignedIn>
          <UserButton />
        </SignedIn>
        <SignedOut>
          <SignInButton>Sign In</SignInButton>
          <SignUpButton>Sign Up</SignUpButton>
        </SignedOut>
      </main>
    </>
  );
}
