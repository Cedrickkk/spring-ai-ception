import { z } from "zod";

export const chatRequestSchema = z.object({
  conversationId: z.string().min(1),
  message: z.string().min(1),
});

export type ChatRequest = z.infer<typeof chatRequestSchema>;
