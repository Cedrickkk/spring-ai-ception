export function ChatHeader() {
  return (
    <header className="bg-background border-border fixed inset-x-0 top-0 z-20 flex h-20 w-full items-center gap-3 border-b px-5">
      <span className="flex shrink-0 items-center gap-1 rounded-lg px-2.5 py-1.5 text-xl">
        <span>🌀</span>
      </span>
      <div className="flex flex-col leading-tight">
        <h1 className="text-foreground text-lg font-semibold tracking-tight">
          Spring AI-ception
        </h1>
        <p className="text-muted-foreground text-xs">A dream within a RAG</p>
      </div>
    </header>
  );
}
