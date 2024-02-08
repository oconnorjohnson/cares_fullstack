"use client";
import React, { useState, useEffect } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { cn } from "@/server/utils";
import { trpc } from "@/app/_trpc/client";
import { newFundType } from "@/server/actions/create/actions";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormLabel,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const formSchema = z.object({
  typeName: z.string().min(1),
  userId: z.string().min(1),
});

export default function NewFundType({ userId }: { userId: string }) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userId: userId,
      typeName: "",
    },
  });
  const { reset } = form;
  const trpcContext = trpc.useUtils();
  const onSubmit = async (data: any) => {
    console.log(data);
    const newFundTypeRecord = await newFundType(data);
    if (newFundTypeRecord) {
      toast.success("New fund type added successfully");
      reset();
      trpcContext.getFundTypes.invalidate();
    } else {
      toast.error("Failed to add new fund type");
    }
    console.log(newFundTypeRecord);
  };

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="default">Add New Fund Type</Button>
        </DialogTrigger>
        <DialogContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="">
              <FormField
                control={form.control}
                name="typeName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Enter Fund Type Name</FormLabel>
                    <FormControl>
                      <Input {...form.register("typeName")} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex flex-row justify-between py-4">
                <DialogClose>
                  <Button variant="default">Cancel</Button>
                </DialogClose>
                <Button onClick={() => form.handleSubmit(onSubmit)}>
                  Add Fund Type
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
