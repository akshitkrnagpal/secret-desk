import { cn } from '@/lib/utils';

interface SaveBarProps {
  isDirty: boolean;
  changeCount: number;
  onSave: () => void;
  onDiscard: () => void;
}

export function SaveBar({ isDirty, changeCount, onSave, onDiscard }: SaveBarProps) {
  return (
    <div className="flex h-11 shrink-0 items-center justify-between border-t border-border px-9 font-sans text-[11.5px] text-muted">
      <span className="flex items-center gap-1.5">
        <span
          className={cn('h-1.5 w-1.5 rounded-full', isDirty ? 'bg-accent' : 'bg-faint')}
        />
        {isDirty
          ? `${changeCount} unsaved change${changeCount !== 1 ? 's' : ''}`
          : 'No changes'}
      </span>
      <div className="flex items-center gap-1.5">
        <button
          onClick={onDiscard}
          disabled={!isDirty}
          className="rounded-md border border-border bg-transparent px-3 py-1.5 text-[12.5px] font-medium text-foreground transition-colors hover:bg-panel-2 disabled:opacity-40"
        >
          Discard
        </button>
        <button
          onClick={onSave}
          disabled={!isDirty}
          className="inline-flex items-center gap-1 rounded-md bg-accent px-3 py-1.5 text-[12.5px] font-medium text-accent-foreground transition-opacity disabled:opacity-40"
        >
          Save
          <span className="ml-1 font-mono text-[10px] opacity-70">⌘S</span>
        </button>
      </div>
    </div>
  );
}
