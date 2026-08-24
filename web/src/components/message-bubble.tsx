import { StreamingIndicator } from "@/components/streaming-indicator";
import type { ChatMessage } from "@/schemas/chat-message";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MessageBubbleProps {
  message: ChatMessage;
}

const proseClassName =
  "prose prose-sm max-w-none prose-p:my-2 first:prose-p:mt-0 last:prose-p:mb-0 " +
  "prose-headings:text-foreground prose-strong:text-foreground " +
  "prose-a:text-primary prose-a:no-underline hover:prose-a:underline " +
  "prose-code:text-foreground prose-code:before:content-none prose-code:after:content-none " +
  "prose-pre:bg-muted prose-pre:text-foreground prose-pre:rounded-md " +
  "prose-blockquote:text-muted-foreground prose-blockquote:border-primary " +
  "prose-li:my-0.5 prose-hr:border-border";

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "user";
  const isStreamingEmpty =
    message.status === "streaming" && message.content === "";
  const isError = message.status === "error";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[80%] rounded-xl px-4 py-2.5 text-[15px] leading-relaxed ${
          isUser
            ? "whitespace-pre-wrap bg-primary text-primary-foreground"
            : isError
              ? "border border-destructive/30 bg-destructive/10 whitespace-pre-wrap text-destructive"
              : "shadow-panel border border-border bg-card text-foreground"
        }`}
      >
        {isStreamingEmpty ? (
          <StreamingIndicator />
        ) : isUser || isError ? (
          message.content
        ) : (
          <div className={proseClassName}>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {message.content}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
}
