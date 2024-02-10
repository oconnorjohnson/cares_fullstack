"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type FundActionProps = {
  children: React.ReactNode;
  fundId: number;
};

export default function FundAction({ children, fundId }: FundActionProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          {children}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{fundId}</DialogTitle>
          <DialogDescription>hellow description</DialogDescription>
        </DialogHeader>
        <div>all the content here.</div>
      </DialogContent>
    </Dialog>
  );
}
