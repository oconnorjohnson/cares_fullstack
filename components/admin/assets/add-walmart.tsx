"use client";
import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusCircleIcon } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@clerk/nextjs";
import { createAsset } from "@/server/actions/create/actions";

const formSchema = z.object({
  FundTypeId: z.number().min(1),
  totalValue: z.number().min(1),
  UserId: z.string().min(1),
  isAvailable: z.boolean(),
  isReserved: z.boolean(),
  isExpended: z.boolean(),
  amount: z.number().min(1),
});

export default function AddAssets() {
  const { userId } = useAuth();
  if (!userId) {
    return <div>Not authenticated</div>;
  }
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      UserId: userId,
      FundTypeId: undefined,
      totalValue: 0,
      isAvailable: true,
      isReserved: false,
      isExpended: false,
      amount: 0,
    },
  });
  async function onSubmit(data: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    console.log(data);
    try {
      const newAssetRecord = await createAsset(data);
      console.log("Asset created successfully:", newAssetRecord);
      setIsSubmitting(false);
    } catch (error) {
      console.error("Error creating asset:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          Arco Gift Cards <div className="px-1" /> <PlusCircleIcon />
        </Button>
      </DialogTrigger>
      <DialogContent className="">
        <DialogHeader>
          <DialogTitle>Add Arco Gift Cards</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="">
          <div className="flex flex-row items-center gap-4"></div>
          <div className="grid grid-cols-4 items-center gap-4"></div>
        </div>
        <DialogFooter>
          <Button type="submit">Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
