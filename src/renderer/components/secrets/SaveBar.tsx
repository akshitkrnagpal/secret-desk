import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SaveBarProps {
  isDirty: boolean;
  changeCount: number;
  onSave: () => void;
  onDiscard: () => void;
}

export function SaveBar({ isDirty, changeCount, onSave, onDiscard }: SaveBarProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-between border-t px-6 py-3 transition-all',
        isDirty ? 'bg-muted/50' : 'opacity-50',
      )}
    >
      <span className="text-sm text-muted-foreground">
        {isDirty ? `${changeCount} change${changeCount !== 1 ? 's' : ''}` : 'No changes'}
      </span>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" disabled={!isDirty} onClick={onDiscard}>
          Discard
        </Button>
        <Button size="sm" disabled={!isDirty} onClick={onSave}>
          Save
        </Button>
      </div>
    </div>
  );
}
