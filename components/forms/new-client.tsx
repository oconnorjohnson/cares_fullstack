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

const formSchema = z.object({
  first_name: z
    .string()
    .min(2, {
      message: "First name must be at least 2 characters.",
    })
    .max(50, {
      message: "First name must not exceed 50 characters.",
    }),
  last_name: z
    .string()
    .min(2, {
      message: "Last name must be at least 2 characters.",
    })
    .max(50, {
      message: "Last name must not exceed 50 characters.",
    }),
  contactInfo: z
    .string()
    .min(7, { message: "Contact info must be at least 7 characters" })
    .max(50, { message: "Contact info must not exceed 50 characters" })
    .refine(
      (value) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^\d{10}$/;
        return emailRegex.test(value) || phoneRegex.test(value);
      },
      {
        message:
          "Contact info must be a valid email address or a 10-digit phone number",
      },
    )
    .optional(),
  caseNumber: z
    .string()
    .min(6, { message: "Case Number must be at least 6 characters" })
    .max(50, { message: "Case Number must not exceed 50 characters" })
    .optional(),
  race: z.string().min(1, { message: "Race must be selected." }),
  sex: z.string().min(1, { message: "Sex must be selected." }),
  dateOfBirth: z.date().refine((date) => date <= new Date(), {
    message: "Date of birth must be in the past.",
  }),
});

export default function NewClient({ userId }: { userId: string | null }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      race: "",
      sex: "",
      dateOfBirth: new Date(),
      contactInfo: "",
      caseNumber: "",
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
        revalidatePath(`/user/clients`);
        revalidatePath(`/dashboard`);
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
              name="first_name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="First Name" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="last_name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Last Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="contactInfo"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="Phone Number of Email Address"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="caseNumber"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Case Number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dateOfBirth"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            " pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground",
                          )}
                        >
                          {format(field.value, "PPP")}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={(date) => {
                          field.onChange(date || new Date());
                        }}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
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
            <Button disabled={isSubmitting} type="submit">
              Add Client
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
