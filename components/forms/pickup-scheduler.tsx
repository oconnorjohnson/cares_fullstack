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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
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
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Calendar as CalendarIcon } from "lucide-react";

const FormSchema = z.object({
  pickup_date: z.date(),
  RequestId: z.number().min(1),
  UserId: z.string().min(1),
});

export default function PickupScheduler({
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
  function onSubmit(data: z.infer<typeof FormSchema>) {
    setIsSubmitting(true);
    try {
      // call server action to create new schedule event for the current request
    } catch (error) {
      console.error(error);
      toast.error("Error submitting form");
    } finally {
      setIsSubmitting(false);
    }
  }
  return (
    <div className="w-full">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Dialog>
            <DialogTrigger asChild>
              <Button>Schedule Pick-Up</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader className="flex flex-col justify-start align-start">
                <DialogTitle>Schedule Funds Pick-Up</DialogTitle>
                <div className="py-2 mr-auto">
                  <DialogDescription className="py-2 outline rounded-xl px-4 mr-auto">
                    <b>Pickup Hours</b> <br /> Mon-Thurs: 8a-12p & 1p-5p <br />{" "}
                    Fri: 8a-12p
                  </DialogDescription>
                </div>
              </DialogHeader>

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
                              format(field.value, "PPP")
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
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => {
                            // Check if the day is Saturday (6) or Sunday (0)
                            const isWeekend =
                              date.getDay() === 0 || date.getDay() === 6;
                            // Check if the date is before today
                            const isPast =
                              date < new Date(new Date().setHours(0, 0, 0, 0));
                            return isWeekend || isPast;
                          }}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    {/* <FormDescription>
                      <b>Pickup Hours</b> <br /> M-Th: 8a-12p and 1p-5p <br />{" "}
                      F: 8a-12p
                    </FormDescription> */}
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                {isSubmitting ? (
                  <Button disabled>
                    <LoadingSpinner className="w-4 h-4 text-white" />
                  </Button>
                ) : (
                  <Button type="submit">Save changes</Button>
                )}
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </form>
      </Form>
    </div>
  );
}
