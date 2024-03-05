"use client";
import React, { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { revalidatePath } from "next/cache";
import { useForm } from "react-hook-form";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { cn } from "@/server/utils";
import { newClient } from "@/server/actions/create/actions";
import { trpc } from "@/app/_trpc/client";
import { LoadingSpinner } from "@/components/admin/request/approve";

const formSchema = z.object({
  clientId: z
    .string()
    .min(1, { message: "clientId must be at least 6 character." }),
  race: z.string().min(1, { message: "Race must be selected." }),
  sex: z.string().min(1, { message: "Sex must be selected." }),
});

export default function NewClient({ userId }: { userId: string | null }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      clientId: "",
      race: "",
      sex: "",
    },
  });
  const { reset } = form;
  const trpcContext = trpc.useUtils();
  async function onSubmit(data: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      if (!userId) {
        throw new Error("User must be authenticated to submit this form.");
      }
      const submissionData = {
        ...data,
        userId,
      };
      const response = await newClient(submissionData);
      if (response && response.id) {
        toast.success("Client created successfully");
        reset();
        trpcContext.getClients.invalidate();
      } else {
        throw new Error("Failed to create client.");
      }
    } catch (error) {
      toast.error("Error submitting form: An unknown error occurred");
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default">Add New Client</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Add New Client</DialogTitle>
        <DialogDescription>
          Fill in the details to add a new client.
        </DialogDescription>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
            <FormField
              control={form.control}
              name="clientId"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="JD1234" {...field} />
                  </FormControl>
                  <FormDescription>
                    Client&apos;s first and last initial combined w/ last 4
                    digits of case number.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="race"
              render={({ field }) => (
                <FormItem>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Race" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="African American / Black">
                        African American / Black
                      </SelectItem>
                      <SelectItem value="American Indian / Alaska Native">
                        American Indian / Alaska Native
                      </SelectItem>
                      <SelectItem value="Asian">Asian</SelectItem>
                      <SelectItem value="Hispanic / Latino">
                        Hispanic / Latino
                      </SelectItem>
                      <SelectItem value="Middle Eastern / North African">
                        Middle Eastern / North African
                      </SelectItem>
                      <SelectItem value="Native Hawaiian / Other Pacific Islander">
                        Native Hawaiian / Other Pacific Islander
                      </SelectItem>
                      <SelectItem value="White">White</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="sex"
              render={({ field }) => (
                <FormItem>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sex" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {isSubmitting ? (
              <Button size="icon" disabled>
                <LoadingSpinner className="w-4 h-4" />
              </Button>
            ) : (
              <Button type="submit">Submit Form</Button>
            )}
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
