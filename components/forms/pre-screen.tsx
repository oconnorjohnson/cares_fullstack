"use client";
import React, { useState, useEffect } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { trpc } from "@/app/_trpc/client";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormLabel,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const formSchema = z.object({
  housingSituation: z.number(),
  housingQuality: z.number(),
  utilityStress: z.number(),
  foodInsecurityStress: z.number(),
  foodMoneyStress: z.number(),
  transpoConfidence: z.number(),
  transpoStress: z.number(),
  financialDifficulties: z.number(),
  additionalInformation: z.string(),
});
