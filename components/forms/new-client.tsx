"use client";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { toast } from "@/components/ui/use-toast";
import { cn } from "@/server/utils";

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
    .max(50, { message: "Contact info must not exceed 50 characters" }),
  caseNumber: z
    .string()
    .min(6, { message: "Case Number must be at least 6 characters" })
    .max(50, { message: "Case Number must not exceed 50 characters" }),
  race: z.string().min(1, { message: "Race must be selected." }),
  sex: z.string().min(1, { message: "Sex must be selected." }),
  dateOfBirth: z.date().refine((date) => date <= new Date(), {
    message: "Date of birth must be in the past.",
  }),
});

export default function NewClient() {
  // define form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      race: "",
      sex: "",
      dateOfBirth: undefined,
    },
  });
  // define submit handler
  function onSubmit(data: z.infer<typeof formSchema>) {
    // do something with the form values
    // this will be type-safe and validated.
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
    console.log(data);
  }
  return (
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
                <Input placeholder="Phone Number of Email Address" {...field} />
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
                        "w-[240px] pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground",
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Date of Birth</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
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
              <Select onValueChange={field.onChange} defaultValue={field.value}>
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
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Sex" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="African American / Black">Male</SelectItem>
                  <SelectItem value="American Indian / Alaska Native">
                    Female
                  </SelectItem>
                  <SelectItem value="Asian">Other</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
