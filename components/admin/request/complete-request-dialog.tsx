"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { completeRequest } from "@/server/actions/rff/complete";
import {
  CompleteRequestFormData,
  completeRequestSchema,
} from "@/server/schemas/complete-request";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

interface CompleteRequestDialogProps {
  requestId: number;
  UserId: string;
  originalAmount: number;
}

export default function CompleteRequestDialog({
  requestId,
  UserId,
  originalAmount,
}: CompleteRequestDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const form = useForm<CompleteRequestFormData>({
    resolver: zodResolver(completeRequestSchema),
    defaultValues: {
      adjustedAmount: originalAmount,
      originalAmount: originalAmount,
      requestId: requestId,
      userId: UserId,
    },
  });

  const onSubmit = async (data: CompleteRequestFormData) => {
    setIsLoading(true);
    try {
      const isCompleted = await completeRequest(data);
      if (isCompleted) {
        toast.success("Request completed successfully.");
        setOpen(false);
      }
    } catch (error) {
      toast.error("Failed to complete request");
      console.error("Error completing request:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button">Complete Request</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Complete Request with Final Amount</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="adjustedAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Final Amount</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="Enter final amount"
                      {...field}
                      onChange={(e) =>
                        field.onChange(parseFloat(e.target.value))
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="text-sm text-muted-foreground">
              Original Amount: ${originalAmount.toFixed(2)}
            </div>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  Completing <LoadingSpinner className="ml-2 h-4 w-4" />
                </>
              ) : (
                "Complete Request"
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
