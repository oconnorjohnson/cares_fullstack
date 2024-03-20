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
          <SheetDescription>
            Transactions are any movement of money in or out of either the CARES
            General Fund or the RFF Grant. Total Balances are the sum of all
            transactions in a given period. Available Balances are the sum of
            all transactions that have not yet been paid out.
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
