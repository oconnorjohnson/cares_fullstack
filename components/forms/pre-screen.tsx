"use client";
import React, { useEffect, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoadingSpinner } from "@/components/admin/request/approve";
import { newPreScreen } from "@/server/actions/create/actions";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { trpc } from "@/app/_trpc/client";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormLabel,
  FormField,
  FormItem,
  FormDescription,
} from "@/components/ui/form";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const formSchema = z.object({
  requestId: z.number().min(1),
  housingSituation: z.number().min(1).max(5),
  housingQuality: z.number().min(1).max(5),
  utilityStress: z.number().min(1).max(5),
  foodInsecurityStress: z.number().min(1).max(5),
  foodMoneyStress: z.number().min(1).max(5),
  transpoConfidence: z.number().min(1).max(5),
  transpoStress: z.number().min(1).max(5),
  financialDifficulties: z.number().min(1).max(5),
  additionalInformation: z.string().min(1).max(500),
});

export default function PreScreen({ requestId }: { requestId: number }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      requestId: requestId,
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
  const closeHandler = (open: boolean) => {
    if (!open) {
      form.reset();
    }
  };
  useEffect(() => {
    if (Object.keys(form.formState.errors).length > 0) {
    }
  }, [form.formState.errors]);
  const trpcContext = trpc.useUtils();
  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      const newPreScreenRecord = await newPreScreen(data, requestId);
      if (newPreScreenRecord) {
        toast.success("Prescreen completed!");

        form.reset();
        trpcContext.getRequests.invalidate();
      } else {
        toast.error("Failed to submit prescreen form.");
      }
    } catch (error) {
      toast.error("An error occurred while submitting the form.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Dialog onOpenChange={closeHandler}>
        <DialogTrigger asChild>
          <Button>Complete Pre-Screen</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogTitle>RFF Pre-Screen Form</DialogTitle>
          <DialogHeader>
            Help your client answer the following questions to receive your
            funds.
          </DialogHeader>
          <div className="p-2">
            {" "}
            <ScrollArea className="h-96 p-4 rounded-md border">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="px-2">
                  <FormField
                    control={form.control}
                    name="housingSituation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Housing Situation</FormLabel>
                        <FormDescription>
                          Today, how stressed are you about your housing
                          situation?
                        </FormDescription>
                        <Select
                          onValueChange={(value) =>
                            field.onChange(Number(value))
                          }
                          defaultValue={
                            field.value ? field.value.toString() : ""
                          }
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a number between 1 and 5" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value={"1"}>1 - Not at all.</SelectItem>
                            <SelectItem value={"2"}>2 - Somewhat.</SelectItem>
                            <SelectItem value={"3"}>3 - Neutral.</SelectItem>
                            <SelectItem value={"4"}>4 - Very.</SelectItem>
                            <SelectItem value={"5"}>5 - Extremely.</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                  <div className="py-2" />
                  <FormField
                    control={form.control}
                    name="housingQuality"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Housing Quality</FormLabel>
                        <FormDescription>
                          How stressed are you about the quality of your housing
                          right now?
                        </FormDescription>
                        <Select
                          onValueChange={(value) =>
                            field.onChange(Number(value))
                          }
                          defaultValue={
                            field.value ? field.value.toString() : ""
                          }
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a number between 1 and 5" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value={"1"}>1 - Not at all.</SelectItem>
                            <SelectItem value={"2"}>2 - Somewhat.</SelectItem>
                            <SelectItem value={"3"}>3 - Neutral.</SelectItem>
                            <SelectItem value={"4"}>4 - Very.</SelectItem>
                            <SelectItem value={"5"}>5 - Extremely.</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                  <div className="py-2" />
                  <FormField
                    control={form.control}
                    name="utilityStress"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Access to Utilities</FormLabel>
                        <FormDescription>
                          How stressed are you about your access to utilities
                          right now? (Electric, heating, gas, water, etc...)
                        </FormDescription>
                        <Select
                          onValueChange={(value) =>
                            field.onChange(Number(value))
                          }
                          defaultValue={
                            field.value ? field.value.toString() : ""
                          }
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a number between 1 and 5" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value={"1"}>1 - Not at all.</SelectItem>
                            <SelectItem value={"2"}>2 - Somewhat.</SelectItem>
                            <SelectItem value={"3"}>3 - Neutral.</SelectItem>
                            <SelectItem value={"4"}>4 - Very.</SelectItem>
                            <SelectItem value={"5"}>5 - Extremely.</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                  <div className="py-2" />
                  <FormField
                    control={form.control}
                    name="foodInsecurityStress"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Food Insecurity Stress</FormLabel>
                        <FormDescription>
                          How stressed are you due to issues related to food
                          insecurity?
                        </FormDescription>
                        <Select
                          onValueChange={(value) =>
                            field.onChange(Number(value))
                          }
                          defaultValue={
                            field.value ? field.value.toString() : ""
                          }
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a number between 1 and 5" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value={"1"}>1 - Not at all.</SelectItem>
                            <SelectItem value={"2"}>2 - Somewhat.</SelectItem>
                            <SelectItem value={"3"}>3 - Neutral.</SelectItem>
                            <SelectItem value={"4"}>4 - Very.</SelectItem>
                            <SelectItem value={"5"}>5 - Extremely.</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                  <div className="py-2" />
                  <FormField
                    control={form.control}
                    name="foodMoneyStress"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Food Financial Stress</FormLabel>
                        <FormDescription>
                          How stressed are you about your food running out
                          before you get money to buy more?
                        </FormDescription>
                        <Select
                          onValueChange={(value) =>
                            field.onChange(Number(value))
                          }
                          defaultValue={
                            field.value ? field.value.toString() : ""
                          }
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a number between 1 and 5" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value={"1"}>1 - Not at all.</SelectItem>
                            <SelectItem value={"2"}>2 - Somewhat.</SelectItem>
                            <SelectItem value={"3"}>3 - Neutral.</SelectItem>
                            <SelectItem value={"4"}>4 - Very.</SelectItem>
                            <SelectItem value={"5"}>5 - Extremely.</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                  <div className="py-2" />
                  <FormField
                    control={form.control}
                    name="transpoConfidence"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Transportation Confidence</FormLabel>
                        <FormDescription>
                          How confident are you that you can make it to
                          important medical appointments, legal hearings, work,
                          etc...?
                        </FormDescription>
                        <Select
                          onValueChange={(value) =>
                            field.onChange(Number(value))
                          }
                          defaultValue={
                            field.value ? field.value.toString() : ""
                          }
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a number between 1 and 5" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value={"1"}>1 - Not at all.</SelectItem>
                            <SelectItem value={"2"}>2 - Somewhat.</SelectItem>
                            <SelectItem value={"3"}>3 - Neutral.</SelectItem>
                            <SelectItem value={"4"}>4 - Very.</SelectItem>
                            <SelectItem value={"5"}>5 - Extremely.</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                  <div className="py-2" />
                  <FormField
                    control={form.control}
                    name="transpoStress"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Transportation Insecurity</FormLabel>
                        <FormDescription>
                          How much stress does transportation insecurity cause
                          you?
                        </FormDescription>
                        <Select
                          onValueChange={(value) =>
                            field.onChange(Number(value))
                          }
                          defaultValue={
                            field.value ? field.value.toString() : ""
                          }
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a number between 1 and 5" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value={"1"}>1 - Not at all.</SelectItem>
                            <SelectItem value={"2"}>2 - Somewhat.</SelectItem>
                            <SelectItem value={"3"}>3 - Neutral.</SelectItem>
                            <SelectItem value={"4"}>4 - Very.</SelectItem>
                            <SelectItem value={"5"}>5 - Extremely.</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                  <div className="py-2" />
                  <FormField
                    control={form.control}
                    name="financialDifficulties"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Financial Difficulties</FormLabel>
                        <FormDescription>
                          How difficult is it for you to pay for the very basics
                          like housing, food, medical care, etc...?
                        </FormDescription>
                        <Select
                          onValueChange={(value) =>
                            field.onChange(Number(value))
                          }
                          defaultValue={
                            field.value ? field.value.toString() : ""
                          }
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a number between 1 and 5" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value={"1"}>1 - Not at all.</SelectItem>
                            <SelectItem value={"2"}>2 - Somewhat.</SelectItem>
                            <SelectItem value={"3"}>3 - Neutral.</SelectItem>
                            <SelectItem value={"4"}>4 - Very.</SelectItem>
                            <SelectItem value={"5"}>5 - Extremely.</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                  <div className="py-2" />
                  <FormField
                    control={form.control}
                    name="additionalInformation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Additional Information</FormLabel>
                        <FormDescription>
                          Add additional information about your client&apos;s
                          situation.
                        </FormDescription>
                        <FormControl>
                          <Textarea {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <div className="py-2" />
                  {isSubmitting ? (
                    <Button size="icon" disabled>
                      <LoadingSpinner className="w-4 h-4" />
                    </Button>
                  ) : (
                    <Button type="submit">Submit Form</Button>
                  )}
                  <div className="py-2" />
                </form>
              </Form>
            </ScrollArea>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
