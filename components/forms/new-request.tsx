"use client";
import React, { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { cn } from "@/server/utils";
import { trpc } from "@/app/_trpc/client";
import { newClient } from "@/server/actions";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
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
  FormLabel,
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
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import SDOHSelect from "@/components/sdoh-multi-select";
import { ScrollArea } from "@/components/ui/scroll-area";
import RFFSelect from "@/components/rff-assist-multi";

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
  // state to manage active tab
  const [activeTab, setActiveTab] = useState("tab1");
  // function to move to the next tab
  const goToNextTab = () => {
    const nextTab = `tab${parseInt(activeTab[3]) + 1}`;
    setActiveTab(nextTab);
  };
  // function to move to the last tab
  const goToLastTab = () => {
    if (activeTab !== "tab`") {
      const lastTab = `tab${parseInt(activeTab[3]) - 1}`;
      setActiveTab(lastTab);
    }
  };
  // initialize useForm with formSchema type
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

          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            defaultValue="tab1"
          >
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-2"
              >
                <TabsContent value="tab1">
                  {!isLoading && clients && (
                    <FormField
                      control={form.control}
                      name="clientId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Client</FormLabel>
                          <Select
                            onValueChange={(value) =>
                              field.onChange(parseInt(value, 10))
                            }
                            defaultValue={
                              field.value ? field.value.toString() : ""
                            }
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
                        <FormLabel>Requesting Agency</FormLabel>
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
                  <FormField
                    control={form.control}
                    name="agency"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Details of Client's Problem</FormLabel>
                        <Textarea className="resize-none" />
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button onClick={goToNextTab}>Next</Button>
                </TabsContent>
                <TabsContent value="tab2">
                  <FormField
                    control={form.control}
                    name="sdoh"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>SDOH Categories</FormLabel>
                        <SDOHSelect />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="rff"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>How can RFF assist?</FormLabel>
                        <RFFSelect />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex flex-row justify-between">
                    <Button onClick={goToLastTab}>Last</Button>
                    <Button onClick={goToNextTab}>Next</Button>
                  </div>
                </TabsContent>
                <TabsContent value="tab3">
                  <div className="flex flex-row justify-between">
                    <Button onClick={goToLastTab}>Last</Button>
                    <Button onClick={goToNextTab}>Next</Button>
                  </div>
                </TabsContent>
                <TabsContent value="tab4">
                  <div className="flex flex-row justify-between">
                    <Button onClick={goToLastTab}>Last</Button>
                    <Button type="submit">Submit</Button>
                  </div>
                </TabsContent>
              </form>
            </Form>
          </Tabs>
        </DialogContent>
      </Dialog>
    </>
  );
}
