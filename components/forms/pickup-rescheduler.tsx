"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/server/utils";
import { z } from "zod";
import { format } from "date-fns";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { toast } from "sonner";
import { Calendar as CalendarIcon } from "lucide-react";
import { updateThePickupEvent } from "@/server/actions/create/actions";

const FormSchema = z.object({
  pickup_date: z.string().min(1, {
    message: "Pickup date must be at least 1 character.",
  }),
  RequestId: z.number().min(1),
  UserId: z.string().min(1),
});

export default function PickupRescheduler({
  requestId,
  userId,
}: {
  requestId: number;
  userId: string;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      pickup_date: undefined,
      RequestId: requestId,
      UserId: userId,
    },
  });
  function closeHandler(open: boolean) {
    if (!open) {
      form.reset();
    }
  }
  const isToday = (date: Date) => {
    const today = new Date();
    const localDate = new Date(date.setHours(0, 0, 0, 0));
    const localToday = new Date(today.setHours(0, 0, 0, 0));
    return localDate.getTime() === localToday.getTime();
  };
  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setIsSubmitting(true);
    try {
      await updateThePickupEvent({
        pickup_date: data.pickup_date,
        RequestId: data.RequestId,
        UserId: data.UserId,
      });
    } catch (error) {
      console.error(error);
      toast.error("Error submitting form");
    } finally {
      form.reset();
      toast.success("Pickup scheduled successfully");
      setIsSubmitting(false);
    }
  }
  return (
    <div className="w-full">
      <Dialog onOpenChange={closeHandler}>
        <DialogTrigger asChild>
          <Button>Reschedule Pick-Up</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <DialogHeader className="flex flex-col justify-start align-start">
                <DialogTitle>Reschedule Funds Pick-Up</DialogTitle>
              </DialogHeader>
              <div className="flex flex-col space-y-2 pr-12 mr-auto">
                Come in any time during the following hours on your scheduled
                day:
                <div className="py-2" />
                <DialogDescription className="py-2 outline rounded-xl px-4 mr-auto">
                  Mon-Thurs: 8:30a-12p | 1p-3p
                  <Separator className="my-2 bg-gray-400" />
                  Fri: 8a-12p | Weekend: Closed
                </DialogDescription>
              </div>
              <FormField
                control={form.control}
                name="pickup_date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            className={cn(
                              "w-[240px] pl-3 text-left font-normal ",
                              !field.value,
                            )}
                          >
                            {field.value ? (
                              format(new Date(field.value), "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={
                            field.value ? new Date(field.value) : undefined
                          }
                          onSelect={(date) => {
                            const formattedDate = format(date!, "MM/dd/yyyy");
                            field.onChange(formattedDate);
                          }}
                          disabled={(date) => {
                            const today = new Date(
                              new Date().setHours(0, 0, 0, 0),
                            );
                            const tomorrow = new Date(today);
                            tomorrow.setDate(tomorrow.getDate() + 1);
                            const isWeekend =
                              date.getDay() === 0 || date.getDay() === 6;
                            const isPast = date < today;
                            const isTomorrow =
                              date.getTime() === tomorrow.getTime();
                            const isFridayToday = today.getDay() === 5;
                            const isMonday = date.getDay() === 1;
                            const isMondayAfterFriday =
                              isFridayToday && isMonday;
                            // Pickups can not be scheduled in the past, they can not be scheduled for Saturdays or Sundays, and they can not be cheduled for "today" or "tomorrow", and if "today" is Friday, a pickup can not be scheduled until Tuesday, giving admin plenty of time to arrange for funds to be located at front of office for pick-up.
                            return (
                              isToday(date) ||
                              isWeekend ||
                              isPast ||
                              isTomorrow ||
                              isMondayAfterFriday
                            );
                          }}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex flex-row justify-between">
                <DialogFooter>
                  <DialogClose>Cancel</DialogClose>
                </DialogFooter>
                {isSubmitting ? (
                  <Button disabled>
                    <LoadingSpinner className="w-4 h-4 text-white" />
                  </Button>
                ) : (
                  <Button type="submit">Save</Button>
                )}
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
