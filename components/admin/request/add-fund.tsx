"use client";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
} from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SaveIcon, XIcon, PlusCircleIcon } from "lucide-react";
import { LoadingSpinner } from "@/components/admin/request/approve";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { trpc } from "@/app/_trpc/client";
import { newFund } from "@/server/actions/create/actions";

type AddFundProps = {
  requestId: number;
  fundTypeId: number;
  amount: number;
};

const formSchema = z.object({
  requestId: z.number().min(1, { message: "requestId must be included." }),
  fundTypeId: z.number().min(1, { message: "fundId must be included." }),
  amount: z.number().min(1, { message: "Amount must be included." }),
});

export default function AddFund({ requestId }: { requestId: number }) {
  const [isSaving, setIsSaving] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      requestId: requestId,
      fundTypeId: undefined,
      amount: undefined,
    },
  });
  const { data: fundTypes, isLoading, isError } = trpc.getFundTypes.useQuery();
  const { setValue, watch, register } = form;
  const onSubmit = async (data: AddFundProps) => {
    console.log("Preparing to add fund with data:", data);
    try {
      const result = await newFund({
        requestId: data.requestId,
        fundTypeId: data.fundTypeId,
        amount: data.amount,
      });
      console.log("added fund successfully with data:", result);
    } catch (error) {
      console.error("Error in adding fund:", error);
    }
  };
  return (
    <>
      <div>
        <Dialog>
          <DialogTrigger asChild>
            <Button size="icon" variant="ghost">
              <PlusCircleIcon />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Fund</DialogTitle>
              <DialogDescription>
                Select a fund type, enter an amount, and click Save.
              </DialogDescription>
            </DialogHeader>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="py-2">
                  <div className="hidden">
                    <FormField
                      control={form.control}
                      name="requestId"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <input
                              {...field}
                              type="hidden"
                              name="requestId"
                              value={requestId}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="fundTypeId"
                    render={({ field }) => (
                      <FormItem>
                        <Label htmlFor="name" className="text-right">
                          Fund Type
                        </Label>
                        <Select
                          {...register("fundTypeId")}
                          defaultValue=""
                          onValueChange={(value) => {
                            console.log(
                              `Selected fundTypeId before parsing: ${value}`,
                            );
                            const parsedValue = parseInt(value, 10);
                            console.log(
                              `Selected fundTypeId after parsing: ${parsedValue}`,
                            );
                            setValue("fundTypeId", parsedValue);
                          }}
                        >
                          <FormControl>
                            <SelectTrigger className="w-[180px]">
                              <SelectValue placeholder="Select Fund Type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {fundTypes?.map((fundType) => (
                              <SelectItem
                                key={fundType.id}
                                value={fundType.id.toString()}
                              >
                                {fundType.typeName}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                </div>
                <div className="py-2">
                  <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                      <FormItem>
                        <Label htmlFor="amount" className="text-right">
                          Amount $
                        </Label>
                        <Input
                          {...field}
                          id="amount"
                          type="number"
                          value={field.value?.toString()}
                          onChange={(e) =>
                            field.onChange(parseInt(e.target.value, 10))
                          }
                          className="col-span-3"
                        />
                      </FormItem>
                    )}
                  />
                </div>
                <DialogFooter className="sm:justify-start">
                  <DialogClose asChild>
                    <Button type="button" variant="secondary">
                      Close
                    </Button>
                  </DialogClose>
                  <Button type="submit">Save</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}
