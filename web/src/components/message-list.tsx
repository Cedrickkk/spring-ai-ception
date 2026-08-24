import { MessageBubble } from "@/components/message-bubble";
import type { ChatMessage } from "@/schemas/chat-message";
import { useEffect, useRef } from "react";

interface MessageListProps {
  messages: ChatMessage[];
}

export function MessageList({ messages }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const totalContentLength = messages.reduce(
    (sum, message) => sum + message.content.length,
    0,
  );

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length, totalContentLength]);

  if (messages.length === 0) {
    return (
      <div className="text-muted-foreground flex flex-1 flex-col items-center justify-center gap-2 px-6 text-center">
        <span className="text-3xl">🌀</span>
        <p className="text-foreground text-base font-medium">
          Every idea starts as a single thought.
        </p>
        <p className="text-sm">Ask me anything to plant one.</p>
      </div>
    );
  }

  return (
    <div
      role="log"
      aria-live="polite"
      aria-relevant="additions text"
      className="flex flex-1 flex-col gap-3 overflow-y-auto px-4 py-6"
    >
      {messages.map((message) => (
        <MessageBubble key={message.id} message={message} />
      ))}
      <div ref={bottomRef} />
    </div>
  );
}
