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
import { HelpCircleIcon } from "lucide-react";

export default function LearnMore() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="text-xl font-bold px-5 py-8">
          Learn More <div className="px-1" /> <HelpCircleIcon />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle className="text-2xl font-bold pt-4">
            Understanding Assets and Funds
          </SheetTitle>
          <SheetDescription className="flex flex-col text-md font-semilight">
            <div className="py-2" />
            <Card className="flex flex-row justify-between items-center align-center py-4 pr-6">
              <CornerDownRightIcon size={20} className="w-1/6" />
              <div className="px-1" />
              <div className="w-5/6">
                {" "}
                Assets refer to the physical means of support that must be
                purchased by CARES prior to disbursement to the community.
                Currently, assets are either bus passes, Walmart gift cards, or
                Arco gift cards.
              </div>
            </Card>
            <div className="py-2" />
            <Card className="flex flex-row justify-between items-center align-center py-4 pr-6">
              <CornerDownRightIcon size={20} className="w-1/6" />
              <div className="px-1" />
              <div className="w-5/6">
                {" "}
                As of now, requests exclusively utilize the RFF fund. This means
                that there must be available RFF assets and/or available RFF
                funds in order for a request to be approved.
              </div>
            </Card>
            <div className="py-2" />
            <Card className="flex flex-row justify-between items-center align-center py-4 pr-6">
              <CornerDownRightIcon size={20} className="w-1/6" />
              <div className="px-1" />
              <div className="w-5/6">
                {" "}
                When viewing a request, you can hover over the "Walmart Gift
                Card" or "Arco Gift Card" badges to see the available card
                values. Card values must match available cards in order to
                approve the request.
              </div>
            </Card>
            <div className="py-2" />
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
