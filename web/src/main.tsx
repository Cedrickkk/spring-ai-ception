import { ChatHeader } from "@/components/chat-header.tsx";
import { ChatWindow } from "@/components/chat-window.tsx";
import { ErrorBoundary } from "@/components/error-boundary.tsx";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import "@fontsource/jetbrains-mono/400.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ChatHeader />
        <main className="mx-auto flex h-svh w-full max-w-4xl flex-col pt-20 text-left">
          <ChatWindow />
        </main>
      </QueryClientProvider>
    </ErrorBoundary>
  </StrictMode>,
);
