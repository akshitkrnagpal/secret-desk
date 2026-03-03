import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ErrorStateProps {
  message: string;
  onRetry: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full py-16 text-muted-foreground">
      <div className="mb-4 opacity-40">
        <AlertTriangle className="h-10 w-10" />
      </div>
      <h3 className="text-sm font-medium mb-1">Connection Error</h3>
      <p className="text-xs mb-4 max-w-xs text-center">{message}</p>
      <Button variant="outline" size="sm" onClick={onRetry}>
        <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
        Retry
      </Button>
    </div>
  );
}
