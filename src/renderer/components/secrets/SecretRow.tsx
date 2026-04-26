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

  return (
    <div
      className={cn(
        'relative mb-2 rounded-[9px] border bg-panel px-3.5 py-3',
        edited ? 'border-accent-line' : 'border-border',
      )}
    >
      {edited && (
        <span className="absolute top-3 bottom-3 left-[-1px] w-[2px] rounded-[1px] bg-accent" />
      )}
      <div className="mb-1.5 flex items-center justify-between">
        <div className="flex items-center gap-1.5 min-w-0 flex-1">
          <input
            value={entry.key}
            onChange={(e) => onChange({ ...entry, key: e.target.value })}
            placeholder="KEY_NAME"
            className="min-w-0 flex-1 bg-transparent font-mono text-[11.5px] font-semibold text-foreground placeholder:text-faint focus:outline-none"
          />
          {edited && (
            <span className="shrink-0 rounded-[3px] bg-accent-soft px-1.5 py-px font-mono text-[9.5px] font-medium text-accent">
              EDITED
            </span>
          )}
          {isBinary && (
            <span className="shrink-0 rounded-[3px] bg-foreground/10 px-1.5 py-px font-mono text-[9.5px] font-medium text-muted">
              BINARY
            </span>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-0">
          <span className="mr-2 font-mono text-[10px] text-faint">{entry.value.length}b</span>
          {!isBinary && (
            <button
              onClick={() => setVisible((v) => !v)}
              className="rounded p-1 text-muted hover:bg-panel-2"
              title={visible ? 'Hide' : 'Show'}
            >
              {visible ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
            </button>
          )}
          {!isBinary && (
            <button
              onClick={handleCopy}
              className="rounded p-1 text-muted hover:bg-panel-2"
              title="Copy"
            >
              <Copy className="h-3 w-3" />
            </button>
          )}
          <button
            onClick={onRemove}
            className="rounded p-1 text-muted hover:bg-panel-2 hover:text-danger"
            title="Delete"
          >
            <Trash2 className="h-3 w-3" />
          </button>
        </div>
      </div>

      {isBinary ? (
        <div className="rounded-md border border-border-soft bg-input px-2.5 py-1.5 font-mono text-xs italic text-muted">
          [Binary data · {entry.value.length} bytes · cannot edit inline]
        </div>
      ) : visible ? (
        <textarea
          value={entry.value}
          onChange={(e) => onChange({ ...entry, value: e.target.value })}
          placeholder="value"
          rows={1}
          className="block w-full resize-y rounded-md border border-border-soft bg-input px-2.5 py-1.5 font-mono text-xs text-foreground placeholder:text-faint focus:border-border focus:outline-none"
        />
      ) : (
        <div
          onClick={() => setVisible(true)}
          className="cursor-text overflow-hidden truncate whitespace-nowrap rounded-md border border-border-soft bg-input px-2.5 py-1.5 font-mono text-xs text-faint"
        >
          {masked}
        </div>
      )}
    </div>
  );
}
