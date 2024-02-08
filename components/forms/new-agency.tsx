"use client";
import React from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { trpc } from "@/app/_trpc/client";
import { newAgency } from "@/server/actions/create/actions";
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
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const formSchema = z.object({
  name: z.string().min(1),
  userId: z.string().min(1),
});

export default function NewAgency({ userId }: { userId: string }) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userId: userId,
      name: "",
    },
  });
  const { reset } = form;
  const trpcContext = trpc.useUtils();
  const onSubmit = async (data: any) => {
    console.log(data);
    const newAgencyRecord = await newAgency(data);
    if (newAgencyRecord) {
      toast.success("Agency created");
      reset();
      trpcContext.getAgencies.invalidate();
    } else {
      toast.error("Failed to add new fund type");
    }
    console.log(newAgencyRecord);
  };

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button>Add New Agency</Button>
        </DialogTrigger>
        <DialogContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Enter Agency Name</FormLabel>
                    <FormControl>
                      <Input {...form.register("name")} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex flex-row justify-between py-4">
                <DialogClose>
                  <Button>Cancel</Button>
                </DialogClose>
                <Button onClick={() => form.handleSubmit(onSubmit)}>
                  Add Agency
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
