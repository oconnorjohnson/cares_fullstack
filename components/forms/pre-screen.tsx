"use client";
import React, { useState, useEffect } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { newPreScreen } from "@/server/actions";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { trpc } from "@/app/_trpc/client";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormLabel,
  FormField,
  FormItem,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const formSchema = z.object({
  housingSituation: z.number(),
  housingQuality: z.number(),
  utilityStress: z.number(),
  foodInsecurityStress: z.number(),
  foodMoneyStress: z.number(),
  transpoConfidence: z.number(),
  transpoStress: z.number(),
  financialDifficulties: z.number(),
  additionalInformation: z.string(),
});

export default function PreScreen({ requestId }: { requestId: number }) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      housingSituation: undefined,
      housingQuality: undefined,
      utilityStress: undefined,
      foodInsecurityStress: undefined,
      foodMoneyStress: undefined,
      transpoConfidence: undefined,
      transpoStress: undefined,
      financialDifficulties: undefined,
      additionalInformation: "",
    },
  });
  const { register, handleSubmit, formState } = form;
  const { reset } = form;
  const trpcContext = trpc.useUtils();
  const onSubmit = async (data: any) => {
    console.log(data);
    const newPreScreenRecord = await newPreScreen(data, requestId);
    if (newPreScreenRecord) {
      toast.success("Prescreen completed!");
      reset();
      trpcContext.getRequests.invalidate();
    } else {
      toast.error("Failed to submit prescreen form.");
    }
    console.log(newPreScreenRecord);
  };

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button>Complete Pre-Screen</Button>
        </DialogTrigger>
        <DialogContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="housingSituation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Housing Situation</FormLabel>
                    <FormDescription>
                      How stressed are you about your housing sitution?
                    </FormDescription>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
