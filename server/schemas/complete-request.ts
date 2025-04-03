import { z } from "zod";

export const completeRequestSchema = z.object({
  adjustedAmount: z
    .number()
    .positive("Amount must be greater than 0")
    .finite("Amount must be a valid number"),
  originalAmount: z.number(),
  requestId: z.number(),
  userId: z.string(),
});

export type CompleteRequestFormData = z.infer<typeof completeRequestSchema>;
