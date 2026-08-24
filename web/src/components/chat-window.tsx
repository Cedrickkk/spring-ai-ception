import { MessageInput } from "@/components/message-input";
import { MessageList } from "@/components/message-list";
import { useSendMessage } from "@/hooks/use-send-message";
import { useChatStore } from "@/store/chat-store";

export function ChatWindow() {
  const messages = useChatStore((state) => state.messages);
  const { mutate: sendMessage, isPending } = useSendMessage();

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <MessageList messages={messages} />
      <MessageInput onSend={sendMessage} disabled={isPending} />
    </div>
  );
}
