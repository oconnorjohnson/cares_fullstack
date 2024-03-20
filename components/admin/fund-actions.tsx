"use client";

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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
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
import { TrashIcon, EditIcon } from "lucide-react";
import { revalidatePath } from "next/cache";
import { trpc } from "@/app/_trpc/client";
import { useState } from "react";
import { UpdateFund } from "@/server/actions/update/actions";
import { DeleteFund } from "@/server/actions/delete/actions";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

type FundActionProps = {
  fundId: number;
  fundTypeId: number;
  fundTypeName: string;
  amount: number;
  requestId: number;
  needsReceipt: boolean;
};

type UpdateFundProps = {
  requestId: number;
  amount: number;
  fundTypeId: number;
  fundId: number;
  needsReceipt: boolean;
};

type DeleteFundProps = {
  fundId: number;
};

const formSchema = z.object({
  requestId: z
    .number()
    .min(1, { message: "requestId must be at least 1 number." }),
  fundId: z.number().min(1, { message: "fundId must be at least 1 number." }),
  fundTypeId: z
    .number()
    .min(1, { message: "fundTypeId must be at least 1 number." }),
  amount: z.number().min(1, { message: "Amount must be at least 1 number." }),
  needsReceipt: z.boolean(),
});

export default function FundDropdown({
  fundId,
  fundTypeId,
  fundTypeName,
  amount,
  requestId,
  needsReceipt,
}: FundActionProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      requestId: requestId,
      fundId: fundId,
      fundTypeId: fundTypeId,
      amount: amount,
      needsReceipt: needsReceipt,
    },
  });
  const { data: fundTypes, isLoading, isError } = trpc.getFundTypes.useQuery();
  const { register, handleSubmit, setValue, watch } = form;
  const selectedFundTypeId = watch("fundTypeId");
  const handleDelete = async (requestId: number, fundId: number) => {
    setIsDeleting(true);
    try {
      await DeleteFund(requestId, fundId);
      toast.success("Fund successfully deleted!");
    } catch (error) {
      console.error("Error deleting fund:", error);
      toast.error("Error deleting fund");
    } finally {
      setIsDeleting(false);
    }
  };
  const onSubmit = async (data: UpdateFundProps) => {
    setIsUpdating(true);
    console.log("Preparing to update fund with ID:", data.fundId);
    console.log("Form Data:", data);
    console.log(
      "Request ID:",
      data.requestId,
      "Amount:",
      data.amount,
      "Fund Type ID:",
      data.fundTypeId,
    );
    try {
      const result = await UpdateFund(
        data.fundId,
        data.fundTypeId,
        data.amount,
        data.requestId,
        data.needsReceipt,
      );
      console.log("UpdateFund successful:", result);
      toast.success("Fund successfully updated!");
    } catch (error) {
      console.error("Error in UpdateFund:", error);
      toast.error("Error updating fund");
    } finally {
      setIsUpdating(false);
    }
  };
  const FundTypeId = fundTypeId ? fundTypeId.toString() : undefined;
  return (
    <>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="destructive" size="icon">
            <TrashIcon />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure? This will delete {fundTypeName} of ${amount} from
              the request permanently.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => handleDelete(fundId, requestId)}
              className="bg-destructive"
            >
              {isDeleting ? (
                <LoadingSpinner className="w-4 h-4 text-white" />
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" size="icon">
            <EditIcon />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Fund</DialogTitle>
            <DialogDescription>
              Adjust the fund as necessary. Click save when you&apos;re done.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="grid gap-4 py-4">
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
                  <FormField
                    control={form.control}
                    name="fundId"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <input
                            {...field}
                            type="hidden"
                            name="fundId"
                            value={fundId}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                <div className="items-center gap-4">
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
                          defaultValue={FundTypeId}
                          onValueChange={(value) => {
                            const parsedValue = parseInt(value, 10);
                            setValue("fundTypeId", parsedValue);

                            // Find the selected FundType and its needsReceipt value
                            const selectedFundType = fundTypes?.find(
                              (fundType) => fundType.id === parsedValue,
                            );
                            if (selectedFundType) {
                              // Set the needsReceipt value in the form state
                              setValue(
                                "needsReceipt",
                                selectedFundType.needsReceipt,
                              );
                            } else {
                              setValue("needsReceipt", false);
                            }
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
                <div className="grid grid-cols-4 items-center gap-4">
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
                          value={field.value.toString()}
                          onChange={(e) =>
                            field.onChange(parseInt(e.target.value, 10))
                          }
                          className="col-span-3"
                        />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <DialogFooter>
                <DialogClose>Cancel</DialogClose>
                <Button type="submit" disabled={isUpdating}>
                  {isUpdating ? (
                    <LoadingSpinner className="w-4 h-4 text-white" />
                  ) : (
                    "Submit"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
