"use client";
import { useState, useMemo } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { PlusCircleIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { addBusPasses } from "@/server/actions/create/actions";
import { toast } from "sonner";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useAuth } from "@clerk/nextjs";
import { BUS_PASS_CONFIG } from "@/lib/constants/bus-passes";

const formSchema = z
  .object({
    UserId: z.string().min(1),
    sacAmount: z.coerce.number().min(0, "Amount must be non-negative"),
    yoloAmount: z.coerce.number().min(0, "Amount must be non-negative"),
    balanceSource: z.string().min(1, "Please select a balance source"),
  })
  .refine((data) => data.sacAmount > 0 || data.yoloAmount > 0, {
    message: "You must add at least one bus pass (Sac or Yolo).",
    path: ["sacAmount"],
  });

export default function AddBusPasses() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { userId } = useAuth();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      sacAmount: 0,
      yoloAmount: 0,
      UserId: userId!,
      balanceSource: "",
    },
  });

  // Watch values for live cost calculation
  const sacAmount = form.watch("sacAmount");
  const yoloAmount = form.watch("yoloAmount");

  const costs = useMemo(() => {
    const sacCount =
      typeof sacAmount === "number"
        ? sacAmount
        : parseInt(String(sacAmount), 10) || 0;
    const yoloCount =
      typeof yoloAmount === "number"
        ? yoloAmount
        : parseInt(String(yoloAmount), 10) || 0;
    const sacTotal = sacCount * BUS_PASS_CONFIG.SAC.unitValue;
    const yoloTotal = yoloCount * BUS_PASS_CONFIG.YOLO.unitValue;
    return {
      sacTotal,
      yoloTotal,
      combinedTotal: sacTotal + yoloTotal,
      totalPasses: sacCount + yoloCount,
    };
  }, [sacAmount, yoloAmount]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    console.log("Submitting bus passes:", values);
    try {
      await addBusPasses({
        sacAmount: values.sacAmount,
        yoloAmount: values.yoloAmount,
        UserId: values.UserId,
        balanceSource: values.balanceSource,
      });
      toast.success(
        `Successfully added ${values.sacAmount} Sac and ${values.yoloAmount} Yolo bus passes`,
      );
      form.reset();
      setIsOpen(false);
    } catch (error) {
      console.error("Error adding bus passes:", error);
      toast.error(
        error instanceof Error ? error.message : "Error adding bus passes",
      );
    }
    setIsSubmitting(false);
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full py-8 text-xl font-bold">
          Bus Passes <div className="px-1" /> <PlusCircleIcon />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Bus Passes</DialogTitle>
          <DialogDescription>
            Add Sac ($2.50 single fare) and/or Yolo ($5.00 double fare) bus
            passes to inventory.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="balanceSource"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Balance Source</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select the balance source" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="CARES">CARES</SelectItem>
                      <SelectItem value="RFF">RFF</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Which fund will this purchase come from?
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="sacAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sac Bus Passes</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" placeholder="0" {...field} />
                    </FormControl>
                    <FormDescription>
                      ${BUS_PASS_CONFIG.SAC.unitValue.toFixed(2)} each
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="yoloAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Yolo Bus Passes</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" placeholder="0" {...field} />
                    </FormControl>
                    <FormDescription>
                      ${BUS_PASS_CONFIG.YOLO.unitValue.toFixed(2)} each
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Cost Summary */}
            <div className="rounded-lg border p-4 bg-muted/50">
              <h4 className="font-medium mb-2">Cost Summary</h4>
              <div className="space-y-1 text-sm">
                {costs.sacTotal > 0 && (
                  <div className="flex justify-between">
                    <span>Sac Bus Passes:</span>
                    <span>${costs.sacTotal.toFixed(2)}</span>
                  </div>
                )}
                {costs.yoloTotal > 0 && (
                  <div className="flex justify-between">
                    <span>Yolo Bus Passes:</span>
                    <span>${costs.yoloTotal.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between font-semibold border-t pt-1 mt-1">
                  <span>Total ({costs.totalPasses} passes):</span>
                  <span>${costs.combinedTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              {isSubmitting ? (
                <Button disabled>
                  <LoadingSpinner className="w-4 h-4 text-white" />
                </Button>
              ) : (
                <Button type="submit" disabled={costs.totalPasses === 0}>
                  Add Bus Passes
                </Button>
              )}
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
