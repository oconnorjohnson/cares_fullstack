import { ModeToggle } from "@/components/mode-toggle";
import CurrentUser from "@/components/current-user";
import ExampleUploader from "@/components/example-uploader";
import { SignedIn } from "@clerk/nextjs";

export default function Home() {
  return (
    <>
      <main>
        <ModeToggle />
        <CurrentUser />
        <SignedIn>
          <ExampleUploader />
        </SignedIn>
      </main>
    </>
  );
}
