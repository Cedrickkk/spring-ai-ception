import { useState, type KeyboardEvent } from "react";

interface MessageInputProps {
  onSend: (text: string) => void;
  disabled: boolean;
}

export function MessageInput({ onSend, disabled }: MessageInputProps) {
  const [text, setText] = useState("");

  const submit = () => {
    const trimmed = text.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setText("");
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      submit();
    }
  };

  return (
    <div className="bg-background flex items-end gap-2 p-4">
      <textarea
        value={text}
        onChange={(event) => setText(event.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        rows={2}
        placeholder="Message..."
        aria-label="Message"
        className="border-input bg-background text-foreground placeholder:text-muted-foreground focus:ring-ring max-h-48 min-h-16 flex-1 resize-none rounded-lg border px-4 py-3 text-base outline-none focus:ring-2 disabled:opacity-60"
      />
      <button
        type="button"
        onClick={submit}
        disabled={disabled || text.trim() === ""}
        className="bg-primary text-primary-foreground rounded-lg px-5 py-3 text-base font-medium transition-opacity disabled:opacity-40"
      >
        Send
      </button>
    </div>
  );
}
