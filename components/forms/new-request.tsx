"use client";
import React, { useState, useEffect } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { cn } from "@/server/utils";
import { trpc } from "@/app/_trpc/client";
import { newClient } from "@/server/actions";
import Means from "@/components/means-selector";
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
import RFFSelect from "@/components/rff-assist-multi";
import { Progress } from "@/components/ui/progress";
import { Option } from "@/components/ui/multiple-selector";

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
  details: z.string(),
  sdoh: z.array(z.string()),
  rff: z.array(z.string()),
  implementation: z.string(),
  sustainability: z.string(),
  means: z.array(z.string()),
  amount: z.string(),
});
const OPTIONS: Option[] = [
  { label: "Food", value: "Food" },
  { label: "Clothing", value: "Clothing" },
  { label: "Hygiene Items", value: "Hygiene Items" },
  { label: "Basic Necessities", value: "Basic Necessities" },
  { label: "Medication Co-Pay", value: "Medication Co-Pay" },
  { label: "Durable Medical Equipment", value: "Durable Medical Equipment" },
  { label: "Gas", value: "Gas" },
  { label: "Rideshare", value: "Rideshare" },
  { label: "Busspass", value: "Busspass" },
  { label: "Specialty Medical Supplies", value: "Specialty Medical Supplies" },
  { label: "Rental Assistance", value: "Rental Assistance" },
  { label: "Utilities Assistance", value: "Utilities Assistance" },
];

// helper function to convert strings -> option objs
const stringsToOptions = (values: string[]): Option[] => {
  return OPTIONS.filter((option) => values.includes(option.value));
};

// helper function to convert Option objs -> strings
const optionsToStrings = (options: Option[]): string[] => {
  return options.map((option) => option.value);
};
export default function NewRequest({ userId }: { userId: string | null }) {
  // state to manage active tab
  const [activeTab, setActiveTab] = useState("tab1");
  // set state for progress bar
  const [progress, setProgress] = useState(0);

  // update progress based on activeTab
  useEffect(() => {
    switch (activeTab) {
      case "tab1":
        setProgress(0);
        break;
      case "tab2":
        setProgress(25);
        break;
      case "tab3":
        setProgress(50);
        break;
      case "tab4":
        setProgress(75);
        break;
      case "tab5":
        setProgress(100);
        break;
      // in future, add fifth tab case to 100% here
      default:
        setProgress(0); // reset to 20% if it's none of the above for safety
    }
  }, [activeTab]);
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
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      clientId: undefined,
      agency: "",
      details: "",
      sdoh: [],
      rff: [],
      means: [],
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
          <Progress value={progress} className="w-full mt-4" />
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
              <form onSubmit={form.handleSubmit(onSubmit)} className="">
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
                    name="details"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Details of Client&apos;s Problem</FormLabel>
                        <Textarea className="resize-none" />

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="p-1" />
                  <div className="flex flex-row justify-end">
                    <Button onClick={goToNextTab}>Next</Button>
                  </div>
                </TabsContent>
                <TabsContent value="tab2">
                  <FormField
                    control={form.control}
                    name="sdoh"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>SDOH Categories</FormLabel>
                        <SDOHSelect
                          value={stringsToOptions(field.value)}
                          onChange={(selectedOptions: Option[]) =>
                            field.onChange(optionsToStrings(selectedOptions))
                          }
                        />
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
                        <RFFSelect
                          value={stringsToOptions(field.value)}
                          onChange={(selectedOptions: Option[]) =>
                            field.onChange(optionsToStrings(selectedOptions))
                          }
                          // Pass other necessary props to RFFSelect
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="p-1" />
                  <div className="flex flex-row justify-between">
                    <Button onClick={goToLastTab}>Last</Button>
                    <Button onClick={goToNextTab}>Next</Button>
                  </div>
                </TabsContent>
                <TabsContent value="tab3">
                  <FormField
                    control={form.control}
                    name="implementation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Plan for implementation of RFF supports:
                        </FormLabel>
                        <Textarea className="resize-none" />

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="sustainability"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Plan for sustainability if RFF is supporting a problem
                          that has an ongoing cost. Write N/A if problem is NOT
                          ongoing.
                        </FormLabel>
                        <Textarea className="resize-none" />

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="p-1" />
                  <div className="flex flex-row justify-between">
                    <Button onClick={goToLastTab}>Last</Button>
                    <Button onClick={goToNextTab}>Next</Button>
                  </div>
                </TabsContent>
                <TabsContent value="tab4">
                  <FormField
                    control={form.control}
                    name="means"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Means of utilizing support:</FormLabel>
                        <Means
                          value={stringsToOptions(field.value)}
                          onChange={(selectedOptions: Option[]) =>
                            field.onChange(optionsToStrings(selectedOptions))
                          }
                        />

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Amount Requested &#40;Ex&#58; Arco&#58; $25, Bus
                          Passes&#58; 2&#41;{" "}
                        </FormLabel>
                        <Input />
                      </FormItem>
                    )}
                  />
                  <div className="p-1" />
                  <div className="flex flex-row justify-between">
                    <Button onClick={goToLastTab}>Last</Button>
                    <Button onClick={goToNextTab}>Next</Button>
                  </div>
                </TabsContent>
                <TabsContent value="tab5">
                  <FormItem>
                    <FormLabel>
                      Your request has been submitted! You&apos;ll get an email
                      when your request has moved to the next stage of
                      processing.
                    </FormLabel>
                    <div className="py-2" />
                  </FormItem>
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
