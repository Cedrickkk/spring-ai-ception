import { z } from "zod";

export const chatRoleSchema = z.enum(["user", "assistant"]);

export const chatMessageStatusSchema = z.enum(["streaming", "done", "error"]);

export const chatMessageSchema = z.object({
  id: z.string(),
  role: chatRoleSchema,
  content: z.string(),
  createdAt: z.number(),
  status: chatMessageStatusSchema.optional(),
});

export type ChatRole = z.infer<typeof chatRoleSchema>;
export type ChatMessageStatus = z.infer<typeof chatMessageStatusSchema>;
export type ChatMessage = z.infer<typeof chatMessageSchema>;
