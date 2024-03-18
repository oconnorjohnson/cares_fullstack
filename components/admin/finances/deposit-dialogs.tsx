import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusCircleIcon } from "lucide-react";
import {
  createOperatingDeposit,
  createRFFDeposit,
} from "@/server/actions/create/actions";

export function RFFDepositDialog({ version }: { version: number }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          Deposit <div className="px-1" /> <PlusCircleIcon />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Deposit Money to RFF Grant </DialogTitle>
          <DialogDescription>
            Note the total amount deposited and details of the transaction.
          </DialogDescription>
        </DialogHeader>
        <form action={createRFFDeposit} method="POST">
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="amount" className="text-left">
                Amount
              </Label>
              <Input
                type="number"
                name="amount"
                id="amount"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="details" className="text-left">
                Details
              </Label>
              <Input
                type="text"
                name="details"
                id="details"
                className="col-span-3"
              />
            </div>
          </div>
          <div className="w-full flex flex-row justify-between">
            <DialogClose asChild>
              <Button>Cancel</Button>
            </DialogClose>
            <Button type="submit">Deposit</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function CARESDepositDialog({ version }: { version: number }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          Deposit <div className="px-1" /> <PlusCircleIcon />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Deposit Money to CARES General Fund </DialogTitle>
          <DialogDescription>
            Note the total amount deposited and details of the transaction.
          </DialogDescription>
        </DialogHeader>
        <form action={createOperatingDeposit} method="POST">
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="amount" className="text-left">
                Amount
              </Label>
              <Input
                type="number"
                name="amount"
                id="amount"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="details" className="text-left">
                Details
              </Label>
              <Input
                type="text"
                name="details"
                id="details"
                className="col-span-3"
              />
            </div>
          </div>
          <div className="w-full flex flex-row justify-between">
            <DialogClose asChild>
              <Button>Cancel</Button>
            </DialogClose>
            <Button type="submit">Deposit</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
