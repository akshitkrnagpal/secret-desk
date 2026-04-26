import { useState } from 'react';
import { Eye, EyeOff, Copy, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import type { SecretEntry } from '../../../shared/types';

interface SecretRowProps {
  entry: SecretEntry;
  edited: boolean;
  onChange: (entry: SecretEntry) => void;
  onRemove: () => void;
}

export function SecretRow({ entry, edited, onChange, onRemove }: SecretRowProps) {
  const [visible, setVisible] = useState(false);
  const isBinary = !!entry.isBinary;
  const masked = '•'.repeat(Math.min(entry.value.length, 28));

  const handleCopy = async () => {
    if (isBinary) return;
    try {
      await navigator.clipboard.writeText(entry.value);
      toast.success('Value copied');
    } catch {
      toast.error('Copy failed');
    }
  };

  const inputBase =
    'rounded-md border bg-input px-2.5 py-1.5 font-mono text-xs text-foreground placeholder:text-faint focus:outline-none transition-colors';
  const inputBorder = edited ? 'border-accent-line' : 'border-border';

  return (
    <div className="relative grid grid-cols-[1fr_1.6fr_auto] items-center gap-1.5 py-1.5">
      {edited && (
        <span className="absolute -left-2 top-2.5 bottom-2.5 w-[2px] rounded-[1px] bg-accent" />
      )}
      <input
        value={entry.key}
        onChange={(e) => onChange({ ...entry, key: e.target.value })}
        placeholder="KEY_NAME"
        className={cn(inputBase, inputBorder, 'w-full')}
      />
      {isBinary ? (
        <div
          className={cn(
            inputBase,
            'border-border-soft text-muted italic truncate',
          )}
        >
          [Binary · {entry.value.length}b]
        </div>
      ) : visible ? (
        <input
          value={entry.value}
          onChange={(e) => onChange({ ...entry, value: e.target.value })}
          placeholder="value"
          className={cn(inputBase, inputBorder, 'w-full')}
        />
      ) : (
        <div
          onClick={() => setVisible(true)}
          className={cn(
            inputBase,
            inputBorder,
            'cursor-text truncate text-faint select-none',
          )}
          title="Click to reveal"
        >
          {masked}
        </div>
      )}
      <div className="flex items-center gap-0.5">
        {edited && (
          <span className="mr-1.5 rounded-[3px] bg-accent-soft px-1.5 py-px font-mono text-[9.5px] font-medium text-accent">
            EDITED
          </span>
        )}
        <span className="mr-1 font-mono text-[10px] text-faint">
          {entry.value.length}b
        </span>
        {!isBinary && (
          <button
            onClick={() => setVisible((v) => !v)}
            className="rounded-[4px] p-1.5 text-muted transition-colors hover:bg-panel-2"
            title={visible ? 'Hide' : 'Show'}
          >
            {visible ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
          </button>
        )}
        {!isBinary && (
          <button
            onClick={handleCopy}
            className="rounded-[4px] p-1.5 text-muted transition-colors hover:bg-panel-2"
            title="Copy"
          >
            <Copy className="h-3 w-3" />
          </button>
        )}
        <button
          onClick={onRemove}
          className="rounded-[4px] p-1.5 text-muted transition-colors hover:bg-panel-2 hover:text-danger"
          title="Delete"
        >
          <Trash2 className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
}
