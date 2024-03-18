"use client";
import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  createOperatingDeposit,
  createRFFDeposit,
} from "@/server/actions/create/actions";
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
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { trpc } from "@/app/_trpc/client";
import { Input } from "@/components/ui/input";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { toast } from "sonner";
import { PlusCircleIcon } from "lucide-react";

const formSchema = z.object({
  details: z.string().min(1, {
    message: "A brief description of the deposit is required.",
  }),
  totalValue: z
    .string()
    .transform((input) => parseFloat(input))
    .refine((val) => !isNaN(val) && val > 0, {
      message: "A valid positive number is required.",
    }),
  lastVersion: z.number().min(1),
  userId: z.string().min(1),
});

export function RFFDepositDialog({
  version,
  userId,
}: {
  version: number;
  userId: string;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userId: userId,
      totalValue: 0,
      lastVersion: version,
      details: "",
    },
  });
  const trpcContext = trpc.useUtils();
  async function onSubmit(data: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    console.log(data);
    try {
      const newRFFDepositRecord = await createRFFDeposit({
        amount: data.totalValue,
        totalValue: data.totalValue,
        details: data.details,
        lastVersion: data.lastVersion,
        userId: data.userId,
      });
      console.log(
        "Operating deposit created successfully:",
        newRFFDepositRecord,
      );
      toast.success("Operating deposit created successfully");
      return newRFFDepositRecord;
    } catch (error) {
      console.error("Error creating operating deposit:", error);
      toast.error(
        "Error creating operating deposit. Refresh the page and try again.",
      );
      throw error;
    } finally {
      trpcContext.invalidate();
      setIsSubmitting(false);
    }
  }
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          Deposit <div className="px-1" /> <PlusCircleIcon />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Deposit Money to Cares Fund </DialogTitle>
          <DialogDescription>
            Note the total amount deposited and details of the transaction.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="">
            <div className="grid gap-4 py-4">
              <FormField
                control={form.control}
                name="totalValue"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <FormLabel>Amount</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          name="totalValue"
                          id="totalValue"
                          className="col-span-3"
                        />
                      </FormControl>
                    </div>
                    <FormDescription>
                      Note the total amount deposited.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="details"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <FormLabel>Details</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          name="details"
                          id="details"
                          className="col-span-3"
                        />
                      </FormControl>
                    </div>
                    <FormDescription>
                      Summarize the deposit in a few sentences.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="w-full flex flex-row justify-between">
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

export function CARESDepositDialog({
  version,
  userId,
}: {
  version: number;
  userId: string;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userId: userId,
      totalValue: 0,
      lastVersion: version,
      details: "",
    },
  });
  const trpcContext = trpc.useUtils();
  async function onSubmit(data: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    console.log(data);
    try {
      const newOperatingDepositRecord = await createOperatingDeposit({
        amount: data.totalValue,
        totalValue: data.totalValue,
        details: data.details,
        lastVersion: data.lastVersion,
        userId: data.userId,
      });
      console.log(
        "Operating deposit created successfully:",
        newOperatingDepositRecord,
      );
      toast.success("Operating deposit created successfully");
      return newOperatingDepositRecord;
    } catch (error) {
      console.error("Error creating operating deposit:", error);
      toast.error(
        "Error creating operating deposit. Refresh the page and try again.",
      );
      throw error;
    } finally {
      trpcContext.invalidate();
      setIsSubmitting(false);
    }
  }
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          Deposit <div className="px-1" /> <PlusCircleIcon />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Deposit Money to Cares Fund </DialogTitle>
          <DialogDescription>
            Note the total amount deposited and details of the transaction.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="">
            <div className="grid gap-4 py-4">
              <FormField
                control={form.control}
                name="totalValue"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <FormLabel>Amount</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          name="totalValue"
                          id="totalValue"
                          className="col-span-3"
                        />
                      </FormControl>
                    </div>
                    <FormDescription>
                      Note the total amount deposited.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="details"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <FormLabel>Details</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          name="details"
                          id="details"
                          className="col-span-3"
                        />
                      </FormControl>
                    </div>
                    <FormDescription>
                      Summarize the deposit in a few sentences.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="w-full flex flex-row justify-between">
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
