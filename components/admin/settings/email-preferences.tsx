"use client";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { updateAdminEmailPrefs } from "@/server/actions/update/actions";
type AdminEmailPreference = {
  agreementUploaded: boolean;
  caresAssetsAdded: boolean;
  caresBalanceUpdated: boolean;
  id: number;
  postCompleted: boolean;
  receiptUploaded: boolean;
  requestReceived: boolean;
  rffAssetsAdded: boolean;
  rffBalanceUpdated: boolean;
};
const formSchema = z.object({
  id: z.number().min(1),
  requestReceived: z.boolean(),
  postCompleted: z.boolean(),
  receiptUploaded: z.boolean(),
  agreementUploaded: z.boolean(),
  rffBalanceUpdated: z.boolean(),
  caresBalanceUpdated: z.boolean(),
  rffAssetsAdded: z.boolean(),
  caresAssetsAdded: z.boolean(),
});

export default function AdminEmailPreferences({
  currentPreference,
}: {
  currentPreference: AdminEmailPreference;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: currentPreference.id,
      requestReceived: currentPreference.requestReceived,
      postCompleted: currentPreference.postCompleted,
      receiptUploaded: currentPreference.receiptUploaded,
      agreementUploaded: currentPreference.agreementUploaded,
      rffBalanceUpdated: currentPreference.rffBalanceUpdated,
      caresBalanceUpdated: currentPreference.caresBalanceUpdated,
      rffAssetsAdded: currentPreference.rffAssetsAdded,
      caresAssetsAdded: currentPreference.caresAssetsAdded,
    },
  });
  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      await updateAdminEmailPrefs(data);
    } catch (error) {
      console.error(error);
      toast.error("Error updating email preferences");
    } finally {
      toast.success("Email preferences updated successfully");
      setIsSubmitting(false);
    }
  };
  return (
    <div className="space-y-4 text-lg">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="requestReceived"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5 flex flex-col items-start">
                  <FormLabel className="text-base">Request Received</FormLabel>
                  <FormDescription>
                    Receive email notifications when a new request has been
                    submitted.
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="postCompleted"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5 flex flex-col items-start">
                  <FormLabel className="text-base">
                    Post-Screen Completed
                  </FormLabel>
                  <FormDescription>
                    Receive email notifications when a post-screen has been
                    completed.
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="receiptUploaded"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5 flex flex-col items-start">
                  <FormLabel className="text-base">Receipt Uploaded</FormLabel>
                  <FormDescription>
                    Receive email notifications when a receipt has been
                    uploaded.
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="agreementUploaded"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5 flex flex-col items-start">
                  <FormLabel className="text-base">
                    Agreement Uploaded
                  </FormLabel>
                  <FormDescription>
                    Receive email notifications when an agreement has been
                    uploaded.
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="rffBalanceUpdated"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5 flex flex-col items-start">
                  <FormLabel className="text-base">
                    RFF Balance Updated
                  </FormLabel>
                  <FormDescription>
                    Receive email notifications when the RFF balance has been
                    updated.
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="caresBalanceUpdated"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5 flex flex-col items-start">
                  <FormLabel className="text-base">
                    Cares Balance Updated
                  </FormLabel>
                  <FormDescription>
                    Receive email notifications when the CARES balance has been
                    updated.{" "}
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="rffAssetsAdded"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5 flex flex-col items-start">
                  <FormLabel className="text-base">RFF Assets Added</FormLabel>
                  <FormDescription>
                    Receive email notifications when an RFF asset has been
                    added.
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="caresAssetsAdded"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5 flex flex-col items-start">
                  <FormLabel className="text-base">
                    CARES Assets Added
                  </FormLabel>
                  <FormDescription>
                    Receive email notifications when an CARES asset has been
                    added.
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          {isSubmitting ? (
            <Button disabled>
              <LoadingSpinner className="w-4 h-4 text-white" />
            </Button>
          ) : (
            <Button type="submit">Save</Button>
          )}
        </form>
      </Form>
    </div>
  );
}
