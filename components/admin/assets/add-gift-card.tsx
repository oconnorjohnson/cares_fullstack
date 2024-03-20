"use client";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
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
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { PlusCircleIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { addGiftCard } from "@/server/actions/create/actions";
import { toast } from "sonner";
import { trpc } from "@/app/_trpc/client";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useAuth } from "@clerk/nextjs";

const formSchema = z.object({
  UserId: z.string().min(1),
  amount: z
    .string()
    .transform((value) => parseInt(value, 10))
    .refine((value) => !isNaN(value) && value > 0, {
      message: "amount must be at least 1 number.",
    }),
  balanceSource: z.string().min(1),
  lastFour: z.string().min(1, {
    message: "Last 4 digits must be exactly 4 digits.",
  }),
  fundType: z.string().refine((value) => /^\d{1}$/.test(value), {
    message: "Last 4 digits must be exactly 4 digits.",
  }),
});

export default function AddBusPasses() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { userId } = useAuth();
  if (!userId) {
    return <div>Not authenticated</div>;
  }
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: 0,
      UserId: userId,
      balanceSource: "",
      fundType: "",
      lastFour: "1234",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    // values.totalValue = values.amount * 2.5;
    console.log(values);
    try {
      await addGiftCard({
        amount: values.amount,
        UserId: values.UserId,
        balanceSource: values.balanceSource,
        lastFour: values.lastFour,
        fundType: values.fundType,
      });
      toast.success("Walmart Gift Cards added successfully");
    } catch (error) {
      console.error("Error adding bus passes:", error);
      toast.error("Error adding bus passes");
    }
    form.reset();
    setIsSubmitting(false);
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-full py-8 text-xl font-bold">
          Gift Cards <div className="px-1" /> <PlusCircleIcon />
        </Button>
      </DialogTrigger>
      <DialogContent className="">
        <DialogHeader>
          <DialogTitle>Add Gift Card</DialogTitle>
          <DialogDescription>
            Fill in the details to add a new gift card.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="balanceSource"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Balance Source</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select the balance source" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="CARES">CARES</SelectItem>
                      <SelectItem value="RFF">RFF</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>(CARES vs. RFF)</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="fundType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Card Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select the card type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="1">Walmart</SelectItem>

                      <SelectItem value="2">Arco</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>(Walmart vs. Arco)</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Total Cash Value of Card</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="amount" {...field} />
                  </FormControl>
                  <FormDescription>(e.g. $100)</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastFour"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last 4 digits of Card</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="" {...field} />
                  </FormControl>
                  <FormDescription>(e.g. 1234)</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {isSubmitting ? (
              <Button disabled>
                <LoadingSpinner className="w-4 h-4 text-white" />
              </Button>
            ) : (
              <Button type="submit">Submit</Button>
            )}
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
