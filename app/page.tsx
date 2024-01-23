import { ModeToggle } from "@/components/mode-toggle";
import CurrentUser from "@/components/current-user";
import ExampleUploader from "@/components/example-uploader";
import { SignedIn } from "@clerk/nextjs";
import NavBar from "@/components/navbar";

export default function Home() {
  return (
    <>
      <main>
        <NavBar />
        <ModeToggle />
        <CurrentUser />
        <SignedIn>
          <ExampleUploader />
        </SignedIn>
      </main>
    </>
  );
}
