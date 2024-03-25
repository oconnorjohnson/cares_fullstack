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
import { Separator } from "@/components/ui/separator";
import { Card } from "@/components/ui/card";
import { CornerDownRightIcon } from "lucide-react";

export default function LearnMore() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Learn More</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle className="text-2xl font-bold pt-4">
            Understanding Transactions and Balances
          </SheetTitle>
          <SheetDescription className="flex flex-col text-md font-semilight">
            <div className="py-2" />
            <Card className="flex flex-row justify-between items-center align-center py-4 pr-6">
              <CornerDownRightIcon size={20} className="w-1/6" />
              <div className="px-1" />
              <div className="w-5/6">
                {" "}
                The balances tracked in this platform are not synced with any
                external financial institutions.
              </div>
            </Card>
            <div className="py-2" />
            <Card className="flex flex-row justify-between items-center align-center py-4 pr-6">
              <CornerDownRightIcon size={20} className="w-1/6" />
              <div className="px-1" />
              <div className="w-5/6">
                {" "}
                The architecture of the platform is designed to allow for a
                rough mirroring of our finances as they relate to the
                acquisition of assets and distribution of funds to the
                community.
              </div>
            </Card>
            <div className="py-2" />
            <Card className="flex flex-row justify-between items-center align-center py-4 pr-6">
              <CornerDownRightIcon size={20} className="w-1/6" />
              <div className="px-1" />
              <div className="w-5/6">
                {" "}
                The RFF Balance represents the funds received from the Resilient
                Futures Fund Grant. The CARES balance represents our CARES
                general fund. As new grants are acheived, new balances can be
                added to the platform to differentiate between resource
                allocation.
              </div>
            </Card>
            <div className="py-2" />
            <Card className="flex flex-row justify-between items-center align-center py-4 pr-6">
              <CornerDownRightIcon size={20} className="w-1/6" />
              <div className="px-1" />
              <div className="w-5/6">
                {" "}
                To maintain accuracy, ensure that all deposits and withdrawals
                are entered into the platform as soon as possible.
              </div>
            </Card>
            <div className="py-2" />
            <Card className="flex flex-row justify-between items-center align-center py-4 pr-6">
              <CornerDownRightIcon size={20} className="w-1/6" />
              <div className="px-1" />
              <div className="w-5/6">
                {" "}
                This is a rough approximation of our finances and is not
                intended to be a complete representation of our financial
                situation.
              </div>
            </Card>
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
