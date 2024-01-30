"use client";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

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
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";

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
  function onSubmit(values: z.infer<typeof formSchema>) {
    // do something with the form values
    // this will be type-safe and validated.
    console.log(values);
  }
}
