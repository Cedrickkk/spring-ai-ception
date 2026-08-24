import { Component, type ErrorInfo, type ReactNode } from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  error: Error | null;
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Unhandled error in chat UI:", error, errorInfo);
  }

  render() {
    if (this.state.error) {
      return (
        <div className="flex h-svh w-full flex-col items-center justify-center gap-2 px-6 text-center">
          <span className="text-3xl">🌀</span>
          <p className="text-foreground text-base font-medium">
            The dream collapsed.
          </p>
          <p className="text-muted-foreground text-sm">
            Something went wrong. Try reloading to wake up.
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}
