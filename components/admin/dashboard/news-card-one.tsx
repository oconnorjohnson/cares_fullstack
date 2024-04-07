"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import type { NewsCard } from "@/components/admin/dashboard/news-updater";
const formSchema = z.object({
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
    .max(100, { message: "Card Content must be at most 100 characters." }),
});
export default function NewsCardThree({
  newsCardOneData,
}: {
  newsCardOneData: NewsCard;
}) {
  const cardTitle = newsCardOneData.card_title;
  const cardDescription = newsCardOneData.card_description;
  const cardContent = newsCardOneData.card_content;
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      card_title: cardTitle,
      card_description: cardDescription,
      card_content: cardContent,
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }
  return (
    <Card className="w-2/3 h-[350px]">
      <CardHeader>
        <CardTitle>{newsCardOneData.card_title}</CardTitle>
        <CardDescription>{newsCardOneData.card_description}</CardDescription>
      </CardHeader>
      <CardContent className="border py-4 mx-4 rounded-lg">
        {newsCardOneData.card_content}
      </CardContent>
      <CardFooter className="py-4">
        <Dialog>
          <DialogTrigger asChild>
            <Button>Edit</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit News Card #1</DialogTitle>
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
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <DialogClose>
                    <Button>Cancel</Button>
                  </DialogClose>
                  <Button type="submit">Save changes</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
}
