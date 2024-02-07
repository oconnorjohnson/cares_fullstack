"use client";
import React, { useState, useEffect } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { newPreScreen } from "@/server/actions";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { trpc } from "@/app/_trpc/client";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
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
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
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
          <Button>Complete Pre-Screen with Client</Button>
        </DialogTrigger>
        <DialogContent>
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
                          How stressed are you about your housing situation?
                        </FormDescription>
                        <FormControl>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a number between 1 and 5" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value={"1 - Not at all."}>
                                1
                              </SelectItem>
                              <SelectItem value={"2 - Somewhat."}>2</SelectItem>
                              <SelectItem value={"3 - Neutral."}>3</SelectItem>
                              <SelectItem value={"4 - Very."}>4</SelectItem>
                              <SelectItem value={"5 - Extremely."}>
                                5
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <div className="py-2" />
                  <FormField
                    control={form.control}
                    name="housingSituation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Housing Quality</FormLabel>
                        <FormDescription>
                          How stressed are you about the quality of your housing
                          right now?
                        </FormDescription>
                        <FormControl>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a number between 1 and 5" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value={"1 - Not at all."}>
                                1
                              </SelectItem>
                              <SelectItem value={"2 - Somewhat."}>2</SelectItem>
                              <SelectItem value={"3 - Neutral."}>3</SelectItem>
                              <SelectItem value={"4 - Very."}>4</SelectItem>
                              <SelectItem value={"5 - Extremely."}>
                                5
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
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
                        <FormControl>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a number between 1 and 5" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value={"1 - Not at all."}>
                                1
                              </SelectItem>
                              <SelectItem value={"2 - Somewhat."}>2</SelectItem>
                              <SelectItem value={"3 - Neutral."}>3</SelectItem>
                              <SelectItem value={"4 - Very."}>4</SelectItem>
                              <SelectItem value={"5 - Extremely."}>
                                5
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
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
                        <FormControl>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a number between 1 and 5" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value={"1 - Not at all."}>
                                1
                              </SelectItem>
                              <SelectItem value={"2 - Somewhat."}>2</SelectItem>
                              <SelectItem value={"3 - Neutral."}>3</SelectItem>
                              <SelectItem value={"4 - Very."}>4</SelectItem>
                              <SelectItem value={"5 - Extremely."}>
                                5
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
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
                        <FormControl>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a number between 1 and 5" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value={"1 - Not at all."}>
                                1
                              </SelectItem>
                              <SelectItem value={"2 - Somewhat."}>2</SelectItem>
                              <SelectItem value={"3 - Neutral."}>3</SelectItem>
                              <SelectItem value={"4 - Very."}>4</SelectItem>
                              <SelectItem value={"5 - Extremely."}>
                                5
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
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
                        <FormControl>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a number between 1 and 5" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value={"1 - Not at all."}>
                                1
                              </SelectItem>
                              <SelectItem value={"2 - Somewhat."}>2</SelectItem>
                              <SelectItem value={"3 - Neutral."}>3</SelectItem>
                              <SelectItem value={"4 - Very."}>4</SelectItem>
                              <SelectItem value={"5 - Extremely."}>
                                5
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
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
                        <FormControl>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a number between 1 and 5" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value={"1 - Not at all."}>
                                1
                              </SelectItem>
                              <SelectItem value={"2 - Somewhat."}>2</SelectItem>
                              <SelectItem value={"3 - Neutral."}>3</SelectItem>
                              <SelectItem value={"4 - Very."}>4</SelectItem>
                              <SelectItem value={"5 - Extremely."}>
                                5
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
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
                        <FormControl>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a number between 1 and 5" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value={"1 - Not at all."}>
                                1
                              </SelectItem>
                              <SelectItem value={"2 - Somewhat."}>2</SelectItem>
                              <SelectItem value={"3 - Neutral."}>3</SelectItem>
                              <SelectItem value={"4 - Very."}>4</SelectItem>
                              <SelectItem value={"5 - Extremely."}>
                                5
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
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
                          How difficult is it for you to pay for the very basics
                          like housing, food, medical care, etc...?
                        </FormDescription>
                        <FormControl>
                          <Textarea {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </form>
              </Form>
            </ScrollArea>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
