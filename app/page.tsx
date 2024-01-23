import {
  SignedIn,
  SignedOut,
  UserButton,
  SignInButton,
  SignUpButton,
} from "@clerk/nextjs";
import { ModeToggle } from "@/components/mode-toggle";
import CurrentUser from "@/components/current-user";

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
        <CurrentUser />
      </main>
    </>
  );
}
