import { streamText } from '@/lib/http-client'
import { chatRequestSchema, type ChatRequest } from '@/schemas/chat-request'

const CHAT_ENDPOINT = '/api/chat'

export async function sendChatMessage(
  request: ChatRequest,
  onChunk: (chunk: string) => void,
  signal?: AbortSignal,
): Promise<string> {
  const validated = chatRequestSchema.parse(request)
  return streamText(CHAT_ENDPOINT, validated, { onChunk, signal })
}
