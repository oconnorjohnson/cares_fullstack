import { Button } from "@/components/ui/button";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignOutButton,
} from "@clerk/nextjs";

export default function SignIn() {
  return (
    <>
      <SignedOut>
        <SignInButton>
          <Button className="rounded-xl">Sign In</Button>
        </SignInButton>
      </SignedOut>
      <SignedIn>
        <SignOutButton>
          <Button className="rounded-xl">Sign Out</Button>
        </SignOutButton>
      </SignedIn>
    </>
  );
}
