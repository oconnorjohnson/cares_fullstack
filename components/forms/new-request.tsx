"use client";
import React, { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { cn } from "@/server/utils";
import { trpc } from "@/app/_trpc/client";
import { newClient } from "@/server/actions";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { Button } from "@/components/ui/button";
interface Client {
  id: number;
  first_name: string;
  last_name: string;
}
type FormValues = z.infer<typeof formSchema>;
const formSchema = z.object({
  clientId: z.number(),
  agency: z
    .string()
    .min(10, {
      message: "Agency must be selected.",
    })
    .max(55, {
      message: "Agency must be selected.",
    }),
});
export default function NewRequest({ userId }: { userId: string | null }) {
  const form = useForm<typeof formSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      clientId: undefined,
      agency: undefined,
    },
  });
  const { reset } = form;
  const trpcContext = trpc.useUtils();
  const onSubmit = (data: any) => {
    console.log(data);
    // Handle form submission here
  };
  const {
    data: clients,
    isLoading,
    isError,
  } = trpc.getClients.useQuery(userId as string, {
    enabled: !!userId,
  });
  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="default">Submit New Request</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogTitle>New Request</DialogTitle>
          <DialogDescription>
            Fill in the details to add a new client.
          </DialogDescription>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
              {!isLoading && clients && (
                <FormField
                  control={form.control}
                  name="clientId"
                  render={({ field }) => (
                    <FormItem>
                      <Select
                        onValueChange={(value) =>
                          field.onChange(parseInt(value, 10))
                        }
                        defaultValue={field.value ? field.value.toString() : ""}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a Client" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {clients.map((client: Client) => (
                            <SelectItem
                              key={client.id}
                              value={client.id.toString()}
                            >
                              {client.first_name} {client.last_name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              <FormField
                control={form.control}
                name="agency"
                render={({ field }) => (
                  <FormItem>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Agency" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Yolo County Public Defender">
                          Yolo County Public Defender
                        </SelectItem>
                        <SelectItem value="Yolo County Probation">
                          Yolo County Probation
                        </SelectItem>
                        <SelectItem value="Yolo County Health & Human Services - RJP">
                          Yolo County Health & Human Services - RJP
                        </SelectItem>
                        <SelectItem value="Yolo County Health & Human Services - AIC">
                          Yolo County Health & Human Services - AIC
                        </SelectItem>
                        <SelectItem value="Yolo County Health & Human Services - Other">
                          Yolo County Health & Human Services - Other
                        </SelectItem>
                        <SelectItem value="Yolo County District Attorny's Office - RJP">
                          Yolo County District Attorny's Office - RJP
                        </SelectItem>
                        <SelectItem value="Conflict Panel Attorneys">
                          Conflict Panel Attorneys
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit">Submit</Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
