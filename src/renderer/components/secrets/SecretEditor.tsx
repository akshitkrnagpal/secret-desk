import { useCallback, useEffect, useMemo } from 'react';
import { useAppContext } from '@/context/AppContext';
import { SecretRow } from './SecretRow';
import { AddRowButton } from './AddRowButton';
import { SaveBar } from './SaveBar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ThemeToggle } from '@/components/layout/ThemeToggle';
import { Clock, KeyRound } from 'lucide-react';
import { toast } from 'sonner';

function shortType(t: string): string {
  if (t === 'Opaque') return 'opaque';
  if (t.includes('tls')) return 'tls';
  if (t.includes('docker')) return 'docker';
  if (t.includes('service-account')) return 'sa-token';
  if (t.includes('basic-auth')) return 'basic';
  return t;
}

function formatAge(createdAt?: string): string {
  if (!createdAt) return '—';
  const ms = Date.now() - new Date(createdAt).getTime();
  const days = Math.floor(ms / 86400000);
  if (days < 1) return '<1d';
  if (days < 30) return `${days}d`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo`;
  return `${Math.floor(months / 12)}y`;
}

export function SecretEditor() {
  const { state, dispatch } = useAppContext();
  const { selectedSecret, editEntries } = state;

  const isDirty = useMemo(() => {
    if (!selectedSecret) return false;
    const original = selectedSecret.entries;
    if (original.length !== editEntries.length) return true;
    return original.some(
      (o, i) => o.key !== editEntries[i].key || o.value !== editEntries[i].value,
    );
  }, [selectedSecret, editEntries]);

  const editedFlags = useMemo(() => {
    if (!selectedSecret) return [] as boolean[];
    return editEntries.map((e, i) => {
      const orig = selectedSecret.entries[i];
      return !orig || orig.key !== e.key || orig.value !== e.value;
    });
  }, [selectedSecret, editEntries]);

  const changeCount = useMemo(() => {
    if (!selectedSecret) return 0;
    const lenDelta = Math.abs(editEntries.length - selectedSecret.entries.length);
    const editsCount = editedFlags.filter(Boolean).length;
    return Math.max(lenDelta, editsCount);
  }, [selectedSecret, editEntries, editedFlags]);

  const handleSave = useCallback(async () => {
    if (!selectedSecret) return;
    try {
      const updated = await window.secretDesk.secrets.update(
        selectedSecret.namespace,
        selectedSecret.name,
        editEntries,
        selectedSecret.resourceVersion,
      );
      dispatch({ type: 'SET_SELECTED_SECRET', secret: updated });
      toast.success('Secret saved');
      const secrets = await window.secretDesk.secrets.list(state.selectedNamespace);
      dispatch({ type: 'SET_SECRETS', secrets });
    } catch (err) {
      const msg = (err as Error).message;
      if (msg.includes('409') || msg.toLowerCase().includes('conflict')) {
        toast.error('Conflict: the secret was modified by someone else. Reload and try again.');
      } else {
        toast.error(`Failed to save: ${msg}`);
      }
    }
  }, [selectedSecret, editEntries, state.selectedNamespace, dispatch]);

  const handleDiscard = () => {
    if (selectedSecret) {
      dispatch({
        type: 'SET_EDIT_ENTRIES',
        entries: selectedSecret.entries.map((e) => ({ ...e })),
      });
    }
  };

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        if (isDirty) handleSave();
      }
    },
    [isDirty, handleSave],
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  if (!selectedSecret) {
    return (
      <main className="flex flex-1 flex-col bg-background">
        <div className="flex h-10 shrink-0 items-center justify-end gap-2 border-b border-border-soft px-4 app-drag-region">
          <div className="no-drag">
            <ThemeToggle />
          </div>
        </div>
        <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center text-muted">
          <KeyRound className="h-8 w-8 opacity-40" />
          <p className="text-sm">
            {state.selectedNamespace
              ? 'Select a secret to view or edit its keys.'
              : 'Pick a namespace and a secret to begin.'}
          </p>
        </div>
      </main>
    );
  }

  const totalBytes = editEntries.reduce((sum, e) => sum + (e.value?.length ?? 0), 0);

  return (
    <main className="flex flex-1 flex-col bg-background min-w-0">
      <div className="flex h-10 shrink-0 items-center justify-end gap-2 border-b border-border-soft px-4 app-drag-region">
        <div className="no-drag">
          <ThemeToggle />
        </div>
      </div>

      <div className="border-b border-border-soft px-9 pt-6 pb-4">
        <div className="mb-1.5 flex items-center gap-2 font-mono text-[11px] text-muted">
          <span>{selectedSecret.namespace}</span>
          <span className="text-faint">/</span>
          <span className="rounded-[3px] bg-accent-soft px-1.5 py-px font-medium text-accent">
            {shortType(selectedSecret.type)}
          </span>
        </div>
        <h2 className="mb-2 font-display text-[26px] font-semibold tracking-[-0.018em] text-foreground">
          {selectedSecret.name}
        </h2>
        <div className="flex items-center gap-4 font-sans text-xs text-muted">
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" /> {formatAge(selectedSecret.createdAt)}
          </span>
          <span className="font-mono text-[11px]">rv·{selectedSecret.resourceVersion}</span>
          <span>
            {editEntries.length} keys · {totalBytes} bytes
          </span>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="px-9 py-4.5">
          {editEntries.map((entry, index) => (
            <SecretRow
              key={index}
              entry={entry}
              edited={editedFlags[index] ?? false}
              onChange={(updated) =>
                dispatch({ type: 'UPDATE_EDIT_ENTRY', index, entry: updated })
              }
              onRemove={() => dispatch({ type: 'REMOVE_EDIT_ENTRY', index })}
            />
          ))}
          <AddRowButton onClick={() => dispatch({ type: 'ADD_EDIT_ENTRY' })} />
        </div>
      </ScrollArea>

      <SaveBar
        isDirty={isDirty}
        changeCount={changeCount}
        onSave={handleSave}
        onDiscard={handleDiscard}
      />
    </main>
  );
}
