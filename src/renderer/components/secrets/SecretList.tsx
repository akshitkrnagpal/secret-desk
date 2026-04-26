import { useMemo, useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { CreateSecretDialog } from '@/components/secrets/CreateSecretDialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { Loader2, Plus, Search, Trash2, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

function shortType(t: string): string {
  if (t === 'Opaque') return 'opaque';
  if (t.includes('tls')) return 'tls';
  if (t.includes('docker')) return 'docker';
  if (t.includes('service-account')) return 'sa-token';
  if (t.includes('basic-auth')) return 'basic';
  return t;
}

export function SecretList() {
  const { state, dispatch } = useAppContext();
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [filter, setFilter] = useState('');

  const filtered = useMemo(() => {
    if (!filter) return state.secrets;
    const f = filter.toLowerCase();
    return state.secrets.filter((s) => s.name.toLowerCase().includes(f));
  }, [filter, state.secrets]);

  const handleSelect = async (name: string) => {
    dispatch({ type: 'SET_LOADING', key: 'secretDetail', value: true });
    try {
      const secret = await window.secretDesk.secrets.get(state.selectedNamespace, name);
      dispatch({ type: 'SET_SELECTED_SECRET', secret });
    } catch (err) {
      toast.error(`Failed to load secret: ${(err as Error).message}`);
    } finally {
      dispatch({ type: 'SET_LOADING', key: 'secretDetail', value: false });
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await window.secretDesk.secrets.delete(state.selectedNamespace, deleteTarget);
      toast.success(`Secret "${deleteTarget}" deleted`);
      const secrets = await window.secretDesk.secrets.list(state.selectedNamespace);
      dispatch({ type: 'SET_SECRETS', secrets });
      if (state.selectedSecret?.name === deleteTarget) {
        dispatch({ type: 'SET_SELECTED_SECRET', secret: null });
      }
    } catch (err) {
      toast.error(`Failed to delete secret: ${(err as Error).message}`);
    }
    setDeleteTarget(null);
  };

  return (
    <aside className="flex w-66 shrink-0 flex-col border-r border-border bg-panel-2">
      <div className="border-b border-border-soft px-3.5 pt-3.5 pb-3">
        <div className="mb-2.5 flex items-center justify-between">
          <span className="font-display text-sm font-semibold text-foreground">
            {state.selectedNamespace || '—'}
          </span>
          <button
            onClick={() => setShowCreate(true)}
            disabled={!state.selectedNamespace}
            className="flex h-5.5 w-5.5 items-center justify-center rounded-[5px] bg-accent text-accent-foreground disabled:opacity-40"
            title="New secret"
          >
            <Plus className="h-3 w-3" />
          </button>
        </div>
        <div className="flex items-center gap-1.5 rounded-md border border-border bg-input px-2.5 py-1.5">
          <Search className="h-3 w-3 text-faint" />
          <input
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Filter…"
            className="flex-1 bg-transparent text-[11.5px] text-foreground placeholder:text-faint focus:outline-none"
          />
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="px-2 py-1.5">
          {state.loading.secrets ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-4 w-4 animate-spin text-muted" />
            </div>
          ) : !state.selectedNamespace ? (
            <div className="px-2 py-8 text-center text-xs text-muted">Select a namespace</div>
          ) : state.error && state.secrets.length === 0 ? (
            <div className="flex flex-col items-center gap-2 px-2 py-8 text-center">
              <AlertTriangle className="h-5 w-5 text-danger opacity-60" />
              <p className="text-xs text-muted">Failed to load secrets</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="px-2 py-8 text-center text-xs text-muted">
              {filter ? 'No matches' : 'No secrets'}
            </div>
          ) : (
            filtered.map((s) => {
              const active = state.selectedSecret?.name === s.name;
              return (
                <div
                  key={s.name}
                  onClick={() => handleSelect(s.name)}
                  className={cn(
                    'group cursor-pointer rounded-[7px] border px-2.5 py-2 mb-0.5 transition-colors',
                    active
                      ? 'border-border bg-panel shadow-[0_1px_2px_rgba(20,15,10,0.04)]'
                      : 'border-transparent hover:bg-panel/60',
                  )}
                >
                  <div className="mb-0.5 flex items-center justify-between gap-2">
                    <div className="truncate font-mono text-xs font-medium text-foreground">
                      {s.name}
                    </div>
                    <button
                      className="shrink-0 rounded p-0.5 text-faint opacity-0 transition-opacity hover:text-danger group-hover:opacity-100"
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteTarget(s.name);
                      }}
                      title="Delete secret"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                  <div className="flex items-center gap-2 font-sans text-[10.5px] text-muted">
                    <span
                      className={cn(
                        'rounded-[3px] px-1.5 py-px font-mono text-[10px]',
                        active
                          ? 'bg-accent-soft text-accent'
                          : 'bg-foreground/5 text-muted',
                      )}
                    >
                      {shortType(s.type)}
                    </span>
                    <span>{s.entries} keys</span>
                    <span className="ml-auto text-faint">
                      {s.createdAt ? new Date(s.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : '-'}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </ScrollArea>

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete Secret"
        description={`Are you sure you want to delete "${deleteTarget}"? This action cannot be undone.`}
        onConfirm={handleDelete}
        confirmText="Delete"
        variant="destructive"
      />

      <CreateSecretDialog open={showCreate} onOpenChange={setShowCreate} />
    </aside>
  );
}
