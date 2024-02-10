"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { TrashIcon, EditIcon } from "lucide-react";
import { trpc } from "@/app/_trpc/client";

type FundActionProps = {
  fundId: number;
  fundTypeId: number;
  fundTypeName: string;
  fundAmount: number;
};

export default function FundDropdown({
  fundId,
  fundTypeId,
  fundTypeName,
  fundAmount,
}: FundActionProps) {
  const { data: fundTypes, isLoading, isError } = trpc.getFundTypes.useQuery();
  // const deleteFundMutation = trpc.deleteFundType.useMutation(fundId);
  return (
    <>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="destructive" size="icon">
            <TrashIcon />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              Type 'Delete' to confirm fund deletion.
              <div className="py-2" />
              <Input placeholder="Delete" />
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" size="icon">
            <EditIcon />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Fund</DialogTitle>
            <DialogDescription>
              Adjust the fund as necessary. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Fund Type
              </Label>
              <Select>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder={fundTypeName} />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {fundTypes?.map((fundType: any) => (
                      <SelectItem key={fundType.id} value={fundType.typeName}>
                        {fundType.typeName}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="username" className="text-right">
                Amount $
              </Label>
              <Input
                id="username"
                defaultValue={fundAmount}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose>Cancel</DialogClose>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
