import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorStateProps {
  message: string;
  onRetry: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="flex h-full flex-col items-center justify-center py-16 text-muted">
      <AlertTriangle className="mb-4 h-10 w-10 text-danger opacity-60" />
      <h3 className="mb-1 font-display text-sm font-semibold text-foreground">
        Connection Error
      </h3>
      <p className="mb-4 max-w-xs text-center text-xs">{message}</p>
      <button
        onClick={onRetry}
        className="inline-flex items-center gap-1.5 rounded-md border border-border bg-panel px-3 py-1.5 text-xs text-foreground transition-colors hover:bg-panel-2"
      >
        <RefreshCw className="h-3 w-3" />
        Retry
      </button>
    </div>
  );
}
