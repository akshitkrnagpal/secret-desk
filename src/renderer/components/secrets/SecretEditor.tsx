import { useCallback, useEffect, useMemo } from 'react';
import { useAppContext } from '@/context/AppContext';
import { SecretRow } from './SecretRow';
import { AddRowButton } from './AddRowButton';
import { SaveBar } from './SaveBar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

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

  const handleSave = async () => {
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
      // Refresh the list
      const secrets = await window.secretDesk.secrets.list(state.selectedNamespace);
      dispatch({ type: 'SET_SECRETS', secrets });
    } catch (err) {
      const msg = (err as Error).message;
      if (msg.includes('409') || msg.toLowerCase().includes('conflict')) {
        toast.error('Conflict: the secret was modified by someone else. Please reload and try again.');
      } else {
        toast.error(`Failed to save: ${msg}`);
      }
    }
  };

  const handleDiscard = () => {
    if (selectedSecret) {
      dispatch({ type: 'SET_EDIT_ENTRIES', entries: selectedSecret.entries.map((e) => ({ ...e })) });
    }
  };

  const handleBack = () => {
    dispatch({ type: 'SET_SELECTED_SECRET', secret: null });
  };

  // Cmd+S shortcut
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

  if (!selectedSecret) return null;

  return (
    <div className="flex flex-col h-full">
      <div className="p-6 pb-0">
        <div className="flex items-center gap-3 mb-4">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h2 className="text-lg font-semibold font-mono">{selectedSecret.name}</h2>
            <div className="flex items-center gap-2 mt-0.5">
              <Badge variant="secondary" className="text-xs font-normal">{selectedSecret.type}</Badge>
              <span className="text-xs text-muted-foreground">{selectedSecret.namespace}</span>
            </div>
          </div>
        </div>

        <div className="rounded-md border">
          <div className="grid grid-cols-[1fr_1fr_auto_auto] gap-0 border-b bg-muted/50 px-4 py-2 text-xs font-medium text-muted-foreground">
            <span>Key</span>
            <span>Value</span>
            <span className="w-9 text-center">Show</span>
            <span className="w-9"></span>
          </div>

          <div className="divide-y">
            {editEntries.map((entry, index) => (
              <SecretRow
                key={index}
                entry={entry}
                index={index}
                onChange={(updated) => dispatch({ type: 'UPDATE_EDIT_ENTRY', index, entry: updated })}
                onRemove={() => dispatch({ type: 'REMOVE_EDIT_ENTRY', index })}
              />
            ))}
          </div>

          <AddRowButton onClick={() => dispatch({ type: 'ADD_EDIT_ENTRY' })} />
        </div>
      </div>

      <div className="mt-auto">
        <SaveBar
          isDirty={isDirty}
          changeCount={isDirty ? Math.abs(editEntries.length - (selectedSecret?.entries.length ?? 0)) || editEntries.filter((e, i) => {
            const orig = selectedSecret?.entries[i];
            return !orig || orig.key !== e.key || orig.value !== e.value;
          }).length : 0}
          onSave={handleSave}
          onDiscard={handleDiscard}
        />
      </div>
    </div>
  );
}
