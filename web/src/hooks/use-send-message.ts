import { sendChatMessage } from "@/api/chat-api";
import { useChatStore } from "@/store/chat-store";
import { useMutation } from "@tanstack/react-query";

export function useSendMessage() {
  const conversationId = useChatStore((state) => state.conversationId);
  const addUserMessage = useChatStore((state) => state.addUserMessage);
  const startAssistantMessage = useChatStore(
    (state) => state.startAssistantMessage,
  );
  const appendAssistantChunk = useChatStore(
    (state) => state.appendAssistantChunk,
  );
  const finishAssistantMessage = useChatStore(
    (state) => state.finishAssistantMessage,
  );
  const failAssistantMessage = useChatStore(
    (state) => state.failAssistantMessage,
  );

  return useMutation({
    mutationFn: async (userText: string) => {
      addUserMessage(userText);
      const assistantId = startAssistantMessage();

      try {
        await sendChatMessage({ conversationId, message: userText }, (chunk) =>
          appendAssistantChunk(assistantId, chunk),
        );
        finishAssistantMessage(assistantId);
      } catch (error) {
        failAssistantMessage(
          assistantId,
          error instanceof Error ? error.message : "Something went wrong.",
        );
        throw error;
      }
    },
  });
}
