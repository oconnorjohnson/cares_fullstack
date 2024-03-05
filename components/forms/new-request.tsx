"use client";
import React, { useState, useEffect, useCallback } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { toast } from "sonner";
import FundSelect from "@/components/forms/sub-components/fund-select";
import { trpc } from "@/app/_trpc/client";
import { newRequest } from "@/server/actions/create/actions";
import { Submitted } from "@/server/actions/resend/actions";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { useRouter } from "next/navigation";
import { LoadingSpinner } from "@/components/admin/request/approve";
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
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import SDOHSelect from "@/components/forms/sub-components/sdoh-multi-select";
import RFFSelect from "@/components/forms/sub-components/rff-assist-multi";
import { Progress } from "@/components/ui/progress";
import { Option } from "@/components/ui/multiple-selector";
import { useUser } from "@clerk/nextjs";

interface Client {
  id: number;
  clientId: string | null;
}

interface Agency {
  id: number;
  name: string;
  userId: string;
}

interface FundInput {
  fundTypeId: number;
  amount: number;
}

const formSchema = z.object({
  clientId: z.number().min(1, "clientId is required"),
  agencyId: z.number().min(1, "agencyId is required"),
  details: z.string().min(1, "details are required"),
  sdoh: z.array(z.string().min(1, "SDOH category selection is required")),
  rff: z.array(z.string().min(1, "RFF category selection is required")),
  implementation: z.string().min(1, "implementation plan is required"),
  sustainability: z.string().min(1, "sustainability plan is required"),
  funds: z.array(
    z.object({
      fundTypeId: z.number().min(1, "fundTypeId is required"),
      amount: z.number().min(1, "amount is required"),
    }),
  ),
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
  { label: "Bus Pass", value: "Bus Pass" },
  { label: "Specialty Medical Supplies", value: "Specialty Medical Supplies" },
  { label: "Rental Assistance", value: "Rental Assistance" },
  { label: "Utilities Assistance", value: "Utilities Assistance" },
  { label: "Education Access", value: "Education Access" },
  { label: "Health Care", value: "Health Care" },
  { label: "Neighborhood Safety", value: "Neighborhood Safety" },
  { label: "Social & Community", value: "Social & Community" },
  { label: "Economic Instability", value: "Economic Instability" },
];

const stringsToOptions = (values: string[]): Option[] => {
  return OPTIONS.filter((option) => values.includes(option.value));
};

const optionsToStrings = (options: Option[]): string[] => {
  return options.map((option) => option.value);
};

type FormInputs = z.infer<typeof formSchema>;

export default function NewRequest({ userId }: { userId: string | null }) {
  const [activeTab, setActiveTab] = useState("tab1");
  const [progress, setProgress] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
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
      default:
        setProgress(0);
    }
  }, [activeTab]);

  const goToNextTab = () => {
    let currentTabIndex = parseInt(activeTab.substring(3));
    if (currentTabIndex < 5) {
      const nextTab = `tab${currentTabIndex + 1}`;
      setActiveTab(nextTab);
    }
  };

  const goToLastTab = () => {
    if (activeTab !== "tab") {
      const lastTab = `tab${parseInt(activeTab[3]) - 1}`;
      setActiveTab(lastTab);
    }
  };
  const router = useRouter();
  const TRPCContext = trpc.useUtils();
  const { user } = useUser();
  const email = user?.emailAddresses[0]?.emailAddress || "";
  const firstName = user?.firstName || "";
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      clientId: undefined,
      agencyId: undefined,
      details: "",
      sdoh: [],
      rff: [],
      sustainability: "",
      implementation: "",
      funds: [{ fundTypeId: undefined, amount: 0 }],
    },
  });

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = form;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "funds",
  });

  const handleFundsChange = useCallback(
    (updatedFunds: FundInput[]) => {
      const normalizedFunds = updatedFunds.map((fund) => ({
        ...fund,
        fundTypeId: Number(fund.fundTypeId),
      }));
      setValue("funds", normalizedFunds);
    },
    [setValue],
  );

  const onSubmit = async (data: FormInputs) => {
    setIsSubmitting(true);
    if (!userId) {
    } else {
      try {
        await newRequest({ ...data, userId, email, firstName });
        try {
          await Submitted({ firstName, email });
        } catch (error) {}
        toast.success("Request submitted successfully");
        TRPCContext.getRequests.invalidate();
        setActiveTab("tab5");
        form.reset();
      } catch (error) {
        toast.error("Failed to submit request");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const { data: agencies, isLoading: isLoadingAgencies } =
    trpc.getAgencies.useQuery();

  const { data: fundTypesData, isLoading: isLoadingFundTypes } =
    trpc.getFundTypes.useQuery();

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
            Fill in the details to submit a new request.
          </DialogDescription>
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            defaultValue="tab1"
          >
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="">
                <TabsContent value="tab1" hidden={activeTab !== "tab1"}>
                  {!isLoading && clients && (
                    <FormField
                      control={control}
                      name="clientId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Client</FormLabel>
                          <FormControl>
                            <Select
                              value={
                                field && field.value !== undefined
                                  ? field.value.toString()
                                  : ""
                              }
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
                                    {client.clientId}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                  {!isLoadingAgencies && agencies && (
                    <FormField
                      control={control}
                      name="agencyId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Agency</FormLabel>
                          <FormControl>
                            <Select
                              value={
                                field && field.value !== undefined
                                  ? field.value.toString()
                                  : ""
                              }
                              onValueChange={(value) =>
                                field.onChange(parseInt(value, 10))
                              }
                              defaultValue={
                                field.value ? field.value.toString() : ""
                              }
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select an Agency" />
                                </SelectTrigger>
                              </FormControl>

                              <SelectContent>
                                {agencies.map((agency: Agency) => (
                                  <SelectItem
                                    key={agency.id}
                                    value={agency.id.toString()}
                                  >
                                    {agency.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                  <FormField
                    control={control}
                    name="details"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Details of Client Problem</FormLabel>
                        <FormControl>
                          <Textarea {...field} className="resize-none" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="p-1" />
                  <div className="flex flex-row justify-end">
                    <Button onClick={goToNextTab}>Next</Button>
                  </div>
                </TabsContent>
                <TabsContent value="tab2" hidden={activeTab !== "tab2"}>
                  <FormField
                    control={control}
                    name="sdoh"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>SDOH Categories</FormLabel>
                        <FormControl>
                          <SDOHSelect
                            value={stringsToOptions(field.value)}
                            onChange={(selectedOptions: Option[]) =>
                              field.onChange(optionsToStrings(selectedOptions))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name="rff"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>How can RFF assist?</FormLabel>
                        <FormControl>
                          <RFFSelect
                            value={stringsToOptions(field.value)}
                            onChange={(selectedOptions: Option[]) =>
                              field.onChange(optionsToStrings(selectedOptions))
                            }
                          />
                        </FormControl>
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
                <TabsContent value="tab3" hidden={activeTab !== "tab3"}>
                  <FormField
                    control={control}
                    name="implementation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Plan for implementation of RFF supports:
                        </FormLabel>
                        <FormControl>
                          <Textarea {...field} className="resize-none" />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name="sustainability"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Plan for sustainability if RFF is supporting a problem
                          that has an ongoing cost. Write N/A if problem is NOT
                          ongoing.
                        </FormLabel>
                        <FormControl>
                          <Textarea {...field} className="resize-none" />
                        </FormControl>

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
                <TabsContent value="tab4" hidden={activeTab !== "tab4"}>
                  <FormField
                    control={control}
                    name="funds"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Select requested funds and note fund amounts.
                        </FormLabel>
                        <FormControl>
                          <FundSelect
                            value={field.value}
                            onChange={handleFundsChange}
                            fundTypesData={fundTypesData || []}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="p-1" />
                  <div className="flex flex-row justify-between">
                    <Button onClick={goToLastTab}>Last</Button>
                    <Button
                      type="submit"
                      onClick={handleSubmit(onSubmit)}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <LoadingSpinner className="w-4 h-4 text-white" />
                      ) : (
                        "Submit"
                      )}
                    </Button>
                  </div>
                </TabsContent>
                <TabsContent value="tab5" hidden={activeTab !== "tab5"}>
                  <FormItem>
                    <FormLabel>
                      Your request has been submitted! Head to your dashboard to
                      complete the pre-screen questionnaire with your client.
                      Once completed, our team will review your request and
                      contact you if necessary.
                    </FormLabel>
                    <div className="py-2" />
                  </FormItem>
                  <div className="flex flex-row justify-between">
                    <DialogClose>
                      <Button
                        onClick={() => {
                          form.reset();
                          setActiveTab("tab1");
                          router.push("/user/requests");
                        }}
                      >
                        View Requests
                      </Button>
                    </DialogClose>
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
