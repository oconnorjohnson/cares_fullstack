"use client";
import React, { useState, useEffect } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { toast } from "sonner";
import { cn } from "@/server/utils";
import { trpc } from "@/app/_trpc/client";
import { newRequest } from "@/server/actions";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
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

interface Agency {
  id: number;
  name: string;
  userId: string;
}

interface FundType {
  id: number;
  typeName: string;
}

interface FundInput {
  fundTypeId: number;
  amount: number;
}

interface SelectedFunds {
  [key: number]: { selected: boolean; amount: number };
}
const fundTypeSchema = z.object({
  selected: z.boolean(),
  amount: z.number(),
});
const formSchema = z.object({
  userId: z.string(),
  clientId: z.number(),
  agencyId: z.number(),
  details: z.string(),
  sdoh: z.array(z.string()),
  rff: z.array(z.string()),
  implementation: z.string(),
  sustainability: z.string(),
  fundType: z.number(),
  amount: z.number(),
  funds: z.array(
    z.object({
      fundTypeId: z.number(),
      amount: z.number(),
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
  { label: "Busspass", value: "Busspass" },
  { label: "Specialty Medical Supplies", value: "Specialty Medical Supplies" },
  { label: "Rental Assistance", value: "Rental Assistance" },
  { label: "Utilities Assistance", value: "Utilities Assistance" },
  { label: "Education Access", value: "Education Access" },
  { label: "Health Care", value: "Health Care" },
  { label: "Neighborhood Safety", value: "Neighborhood Safety" },
  { label: "Social & Community", value: "Social & Community" },
  { label: "Economic Instability", value: "Economic Instability" },
  { label: "Walmart Gift Card", value: "Walmart Gift Card" },
  { label: "Arco Gift Card", value: "Arco Gift Card" },
  { label: "Bus Passes", value: "Bus Passes" },
  { label: "Invoice", value: "Invoice" },
  { label: "Check", value: "Check" },
  { label: "Cash", value: "Cash" },
];

// helper function to convert strings -> option objs
const stringsToOptions = (values: string[]): Option[] => {
  return OPTIONS.filter((option) => values.includes(option.value));
};

// helper function to convert Option objs -> strings
const optionsToStrings = (options: Option[]): string[] => {
  return options.map((option) => option.value);
};

type FormInputs = z.infer<typeof formSchema>;

export default function NewRequest({ userId }: { userId: string | null }) {
  // state to manage fund type data
  const [fundTypesData, setFundTypesData] = useState<FundType[]>([]);
  //state to manage selected funds types
  const [selectedFunds, setSelectedFunds] = useState<SelectedFunds>({});
  const [fundTypeId, setFundTypeId] = useState<number>(0);
  const [amount, setAmount] = useState<number>(0);
  // state to manage active tab
  const [activeTab, setActiveTab] = useState("tab1");
  // set state for progress bar
  const [progress, setProgress] = useState(0);
  // get fund types using trpc
  const { data: fundTypes, isLoading: isLoadingFundTypes } =
    trpc.getFundTypes.useQuery();
  // use effect to manage currently imported fund types
  useEffect(() => {
    if (fundTypes) {
      setFundTypesData(fundTypes);
      // initialize selectedFunds state
      const initialSelectedFunds: SelectedFunds =
        fundTypes.reduce<SelectedFunds>((acc, fundType) => {
          acc[fundType.id] = { selected: false, amount: 0 };
          return acc;
        }, {});
      setSelectedFunds(initialSelectedFunds);
    }
  }, [fundTypes]);
  // functioin to handle fund selection change
  // Update the handleFundSelectionChange function to be more declarative
  const [funds, setFunds] = useState<FundInput[]>([]);
  // function to add new fund input set to UI
  const handleAddFund = () => {
    append({ fundTypeId: 0, amount: 0 }); // Append a new blank fund entry
  };
  // function to remove specific fund input set
  const handleRemoveFund = (index: number) => {
    console.log(funds.length);
    if (fields.length > 1) {
      remove(index);
    } else {
      toast.error("At least one fund must be specified");
    }
  };
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
    let currentTabIndex = parseInt(activeTab.substring(3));
    if (currentTabIndex < 5) {
      const nextTab = `tab${currentTabIndex + 1}`;
      setActiveTab(nextTab);
    }
  };
  // function to move to the last tab
  const goToLastTab = () => {
    if (activeTab !== "tab") {
      const lastTab = `tab${parseInt(activeTab[3]) - 1}`;
      setActiveTab(lastTab);
    }
  };
  // initialize useForm with formSchema type
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      clientId: undefined,
      agencyId: undefined,
      details: "",
      sdoh: [],
      rff: [],
      fundType: undefined,
      amount: undefined,
      sustainability: "",
      implementation: "",
      funds: [{ fundTypeId: 0, amount: 0 }],
    },
  });
  const { control, handleSubmit, setValue, register } = form;
  const { fields, append, remove } = useFieldArray({
    control,
    name: "funds",
  });
  const watchedClientId = form.watch("clientId");
  const watchedAgencyId = form.watch("agencyId");
  const trpcContext = trpc.useUtils();
  const onSubmit = async (data: FormInputs) => {
    try {
      await newRequest(data);
      toast.success("Request submitted successrfully");
    } catch (error) {
      toast.error("Failed to submit request");
      console.log("Form submission started", data);
    }
    alert("Form submitted. Check the console for details.");
  };
  // const onSubmit = async (formData: any) => {
  //   console.log("Attempting form submission", formData);
  //   const selectedFundTypes = Object.entries(selectedFunds)
  //     .filter(([_, value]) => value.selected)
  //     .map(([key, value]) => ({
  //       fundTypeId: key,
  //       amount: value.amount,
  //     }));

  //   //combine `data` with `selectedFundTypes` and submit
  //   const submissionData = {
  //     ...formData,
  //     funds: Object.entries(selectedFundTypes)
  //       .filter(([_, value]) => value.fundTypeId)
  //       .map(([key, value]) => ({
  //         fundTypeId: parseInt(key),
  //         amount: value.amount,
  //       })),
  //   };
  //   // use server action to call prismaFunction to submit data to database
  //   newRequest(submissionData)
  //     .then(() => {
  //       // If the request is successful, show a success message and proceed
  //       toast.success("Request submitted successfully");
  //       form.reset(); // Reset the form to its initial state
  //       goToNextTab(); // Navigate to the next tab
  //     })
  //     .catch((error) => {
  //       // If the request fails, show an error message
  //       toast.error("Failed to submit request");
  //       console.error("Submission error:", error);
  //     });
  // };
  // const handleThirdTabSubmit = () => {
  //   console.log("handleThidTabSubmit clicked");
  //   handleSubmit(onSubmit)();
  // };
  // Fetch agencies using TRPC
  const { data: agencies, isLoading: isLoadingAgencies } =
    trpc.getAgencies.useQuery();

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
          <p>Selected Client ID: {watchedClientId}</p>
          <p>Selected Agency ID: {watchedAgencyId}</p>
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
                                    {client.first_name} {client.last_name}
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
                          <Textarea className="resize-none" />
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
                            // Pass other necessary props to RFFSelect
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
                          <Textarea className="resize-none" />
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
                          <Textarea className="resize-none" />
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
                        {fields.map((field, index) => (
                          <div
                            key={field.id}
                            className="flex items-center gap-2 mb-4"
                          >
                            <FormControl>
                              <Select
                                onValueChange={(value) => {
                                  setValue(
                                    `funds.${index}.fundTypeId`,
                                    parseInt(value),
                                  );
                                }}
                                defaultValue={`${field.fundTypeId}`}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select Fund Type" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {!isLoadingFundTypes &&
                                    fundTypes?.map((fundType) => (
                                      <SelectItem
                                        key={fundType.id}
                                        value={fundType.id.toString()}
                                      >
                                        {fundType.typeName}
                                      </SelectItem>
                                    ))}
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormControl>
                              <Input type="number" />
                            </FormControl>
                            <Button
                              type="button"
                              onClick={() => handleRemoveFund(index)}
                            >
                              Remove
                            </Button>
                          </div>
                        ))}
                      </FormItem>
                    )}
                  />
                  <Button onClick={handleAddFund}>Add Fund</Button>
                  <div className="p-1" />
                  <div className="flex flex-row justify-between">
                    <Button onClick={goToLastTab}>Last</Button>
                    <Button type="submit">Submit</Button>
                  </div>
                </TabsContent>
                <TabsContent value="tab5" hidden={activeTab !== "tab5"}>
                  <FormItem>
                    <FormLabel>
                      Your request has been submitted! You&apos;ll get an email
                      when your request has moved to the next stage of
                      processing.
                    </FormLabel>
                    <div className="py-2" />
                  </FormItem>
                  <div className="flex flex-row justify-between">
                    {/* <Button onClick={goToLastTab}>Last</Button> */}
                    <DialogClose>
                      <Button
                        onClick={() => {
                          form.reset();
                          setActiveTab("tab1");
                        }}
                      >
                        Close
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
