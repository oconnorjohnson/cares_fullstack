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
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusCircleIcon } from "lucide-react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
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
import { createBusPassAssets } from "@/server/actions/create/actions";

const formSchema = z.object({
  UserId: z.string().min(1),
  isAvailable: z.boolean(),
  isReserved: z.boolean(),
  isExpended: z.boolean(),
  FundTypeId: z.number().min(1),
  amount: z
    .string()
    .transform((input) => parseFloat(input))
    .refine((val) => !isNaN(val) && val > 0, {
      message: "A valid positive number is required.",
    }),
  totalValue: z.number().min(1),
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
      isAvailable: true,
      isReserved: false,
      isExpended: false,
      FundTypeId: 3,
      amount: 0,
      totalValue: 0,
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    console.log(data);
    try {
      data.totalValue = data.amount * 2.5;
      const newAssetRecord = await createBusPassAssets(data);
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
          Bus Passes <div className="px-1" /> <PlusCircleIcon />
        </Button>
      </DialogTrigger>
      <DialogContent className="">
        <DialogHeader>
          <DialogTitle>Add Bus Passes</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="">
            <div>
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        name="amount"
                        id="amount"
                        className="col-span-3"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="w-full flex flex-row justify-between pt-4">
              <DialogClose asChild>
                <Button>Cancel</Button>
              </DialogClose>
              {isSubmitting ? (
                <Button disabled>
                  <LoadingSpinner className="w-4 h-4 text-white" />
                </Button>
              ) : (
                <Button type="submit">Submit Deposit</Button>
              )}
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
