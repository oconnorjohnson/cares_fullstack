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
import { trpc } from "@/app/_trpc/client";
import { useState } from "react";
import { UpdateFund } from "@/server/actions/update/actions";
import { DeleteFund } from "@/server/actions/delete/actions";
import { LoadingSpinner } from "@/components/admin/request/approve";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

type FundActionProps = {
  fundId: number;
  fundTypeId: number;
  fundTypeName: string;
  amount: number;
  requestId: number;
};

type UpdateFundProps = {
  requestId: number;
  amount: number;
  fundTypeId: number;
  fundId: number;
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
});

export default function FundDropdown({
  fundId,
  fundTypeId,
  fundTypeName,
  amount,
  requestId,
}: FundActionProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUploading, setIsUpdating] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      requestId: requestId,
      fundId: fundId,
      fundTypeId: fundTypeId,
      amount: amount,
    },
  });
  const { data: fundTypes, isLoading, isError } = trpc.getFundTypes.useQuery();
  const { register, handleSubmit, setValue, watch } = form;
  const selectedFundTypeId = watch("fundTypeId");
  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await DeleteFund(requestId, fundId);
    } catch (error) {
      console.error("Error deleting fund:", error);
    } finally {
      setIsDeleting(false);
    }
  };
  const onSubmit = async (data: UpdateFundProps) => {
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
      );
      console.log("UpdateFund successful:", result);
    } catch (error) {
      console.error("Error in UpdateFund:", error);
    }
  };

  // const deleteFundMutation = trpc.deleteFundType.useMutation(fundId);
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
              Type 'Delete' to confirm fund deletion.
              <div className="py-2" />
              <Input placeholder="Delete" />
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive">
              Delete
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
              Adjust the fund as necessary. Click save when you're done.
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
                          defaultValue={fundTypeId.toString()}
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
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select Fund Type" />
                          </SelectTrigger>
                          <SelectContent>
                            {fundTypes?.map((fundType) => (
                              <SelectItem
                                key={fundType.id}
                                value={fundType.id.toString()} // Ensure this is the fundTypeId
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
                          // Ensure the value is a string, as some custom Input components might expect that
                          value={field.value.toString()}
                          // Handle changes by converting the input value back to a number
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
                <Button type="submit">Save changes</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
