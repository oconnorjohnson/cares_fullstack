"use client";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { updateNewsCards } from "@/server/actions/update/actions";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import type { NewsCard } from "@/components/admin/dashboard/news-updater";
import { Textarea } from "@/components/ui/textarea";
const formSchema = z.object({
  NewsCardId: z.number().min(1),
  card_title: z
    .string()
    .min(2, {
      message: "Card Title must be at least 2 characters.",
    })
    .max(12, { message: "Card Title must be at most 12 characters." }),
  card_description: z
    .string()
    .min(4, {
      message: "Card Description must be at least 4 characters.",
    })
    .max(25, { message: "Card Description must be at most 25 characters." }),
  card_content: z
    .string()
    .min(12, {
      message: "Card Content must be at least 12 characters.",
    })
    .max(250, { message: "Card Content must be at most 250 characters." }),
});
export default function NewsCardThree({
  newsCardTwoData,
}: {
  newsCardTwoData: NewsCard;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const cardTitle = newsCardTwoData.card_title;
  const cardDescription = newsCardTwoData.card_description;
  const cardContent = newsCardTwoData.card_content;
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      NewsCardId: 2,
      card_title: cardTitle,
      card_description: cardDescription,
      card_content: cardContent,
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      await updateNewsCards(
        values.NewsCardId,
        values.card_title,
        values.card_description,
        values.card_content,
      );
      toast.success("News Card Two updated successfully");
    } catch (error) {
      console.error("Error updating news card two:", error);
      toast.error("Error updating news card two");
    } finally {
      setIsSubmitting(false);
    }
  }
  return (
    <Card className="w-2/3 h-[350px] flex flex-col justify-between">
      <CardHeader>
        <CardTitle>{cardTitle}</CardTitle>
        <CardDescription>{cardDescription}</CardDescription>
      </CardHeader>
      <CardContent className="text-sm font-medium">{cardContent}</CardContent>
      <CardFooter className="py-4">
        <Dialog>
          <DialogTrigger asChild>
            <Button>Edit</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit News Card #2</DialogTitle>
              <DialogDescription>
                Edit the news card as necessary.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                <FormField
                  control={form.control}
                  name="card_title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Card Title</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="card_description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Card Description</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="card_content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Card Content</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <DialogClose>
                    <Button>Cancel</Button>
                  </DialogClose>
                  {isSubmitting ? (
                    <Button disabled>
                      <LoadingSpinner className="w-4 h-4 text-white" />
                    </Button>
                  ) : (
                    <Button type="submit">Save changes</Button>
                  )}
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
}
