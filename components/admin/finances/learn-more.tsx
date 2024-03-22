import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export default function LearnMore() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Learn More</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Understanding Transactions & Balances</SheetTitle>
          <SheetDescription className="text-md">
            The balances tracked in this platform are not synced with any
            external financial institutions.
            <br />
            <div className="py-2" />
            The architecture of the platform is designed to allow for a rough
            mirroring of our finances as they relate to the acquisition of
            assets and distribution of funds to the community.
            <br />
            <div className="py-2" />
            This is a rough approximation of our finances and is not intended to
            be a complete representation of our financial situation.
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4"></div>
        <SheetFooter>
          <SheetClose asChild>
            <Button>Close</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
