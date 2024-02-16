import { Terminal } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Link from "next/link";

export function FreshPageAlert() {
  return (
    <>
      <div className="pt-12 px-10">
        <Alert variant="destructive">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Heads up!</AlertTitle>
          <AlertDescription>
            This is a fresh page, and we&apos;re still working on it. Reach out
            to{" "}
            <Link href="mailto:dajohnson@yolocounty.org">
              <u>dajohnson@yolocounty.org</u>
            </Link>{" "}
            with questions, concerns, and requests.
          </AlertDescription>
        </Alert>
      </div>
    </>
  );
}
