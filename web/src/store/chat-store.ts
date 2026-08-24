import type { ChatMessage } from "@/schemas/chat-message";
import { chatPersistedStateSchema } from "@/schemas/chat-persisted-state";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface ChatState {
  conversationId: string;
  messages: ChatMessage[];
  addUserMessage: (content: string) => ChatMessage;
  startAssistantMessage: () => string;
  appendAssistantChunk: (id: string, chunk: string) => void;
  finishAssistantMessage: (id: string) => void;
  failAssistantMessage: (id: string, errorText: string) => void;
}

const STORAGE_KEY = "spring-ai-ception-chat:v1";

export const useChatStore = create<ChatState>()(
  persist(
    (set) => ({
      conversationId: crypto.randomUUID(),
      messages: [],

      addUserMessage: (content) => {
        const message: ChatMessage = {
          id: crypto.randomUUID(),
          role: "user",
          content,
          createdAt: Date.now(),
        };
        set((state) => ({ messages: [...state.messages, message] }));
        return message;
      },

      startAssistantMessage: () => {
        const id = crypto.randomUUID();
        set((state) => ({
          messages: [
            ...state.messages,
            {
              id,
              role: "assistant",
              content: "",
              createdAt: Date.now(),
              status: "streaming",
            },
          ],
        }));
        return id;
      },

      appendAssistantChunk: (id, chunk) => {
        set((state) => ({
          messages: state.messages.map((message) =>
            message.id === id
              ? { ...message, content: message.content + chunk }
              : message,
          ),
        }));
      },

      finishAssistantMessage: (id) => {
        set((state) => ({
          messages: state.messages.map((message) =>
            message.id === id ? { ...message, status: "done" } : message,
          ),
        }));
      },

      failAssistantMessage: (id, errorText) => {
        set((state) => ({
          messages: state.messages.map((message) =>
            message.id === id
              ? { ...message, content: errorText, status: "error" }
              : message,
          ),
        }));
      },
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        conversationId: state.conversationId,
        messages: state.messages,
      }),
      merge: (persistedState, currentState) => {
        const parsed = chatPersistedStateSchema.safeParse(persistedState);
        return parsed.success
          ? { ...currentState, ...parsed.data }
          : currentState;
      },
    },
  ),
);
