import { useState } from "react";

const DREAM_STATUS_MESSAGES = [
  "Constructing the dreamscape...",
  "Falling into Level 4 (Limbo)...",
  "Waiting for the kick...",
  "Stabilizing the paradox...",
  "Extracting the idea...",
  "Spinning the totem...",
  "Folding the city in half...",
  "Descending another level...",
  "Synchronizing the kick...",
  "Checking if this is reality...",
];

function pickDreamStatus() {
  return DREAM_STATUS_MESSAGES[
    Math.floor(Math.random() * DREAM_STATUS_MESSAGES.length)
  ];
}

export function StreamingIndicator() {
  const [status] = useState(pickDreamStatus);

  return (
    <span
      className="inline-flex items-center gap-2 py-1"
      aria-label="Assistant is thinking"
    >
      <span className="animate-totem-spin inline-block text-base leading-none">
        🌀
      </span>
      <span className="text-sm text-muted-foreground">{status}</span>
    </span>
  );
}
