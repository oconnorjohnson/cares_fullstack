"use client";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { BanUser } from "@/server/actions/update/actions";

// Adjust the handleBan function to directly use the userId from props
export default function BanUserButton({ userId }: { userId: string }) {
  const [isBanning, setIsBanning] = useState(false);

  const handleBan = async () => {
    setIsBanning(true);
    try {
      await BanUser(userId);
      // Handle success (e.g., show a success message, update UI)
    } catch (error) {
      // Handle error (e.g., show an error message)
      console.error("Failed to ban user:", error);
    } finally {
      setIsBanning(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" className="bg-destructive">
          Ban User
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>Ban User</DialogHeader>
        <DialogDescription>
          Are you sure you want to ban this user?
        </DialogDescription>
        <DialogFooter>
          <Button
            onClick={handleBan}
            variant="destructive"
            disabled={isBanning}
          >
            {isBanning ? "Banning..." : "Ban"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
