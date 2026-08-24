import { chatMessageSchema } from "@/schemas/chat-message";
import { z } from "zod";

export const chatPersistedStateSchema = z.object({
  conversationId: z.string(),
  messages: z.array(chatMessageSchema),
});

export type ChatPersistedState = z.infer<typeof chatPersistedStateSchema>;
