import { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { IconMark } from './IconMark';
import { cn } from '@/lib/utils';
import { Loader2, AlertTriangle, RefreshCw, ChevronDown, Check, Trash2 } from 'lucide-react';

const APP_VERSION = '1.0.0';

export function Sidebar() {
  const { state, dispatch, retry, deleteContext } = useAppContext();
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const handleContextSwitch = async (contextName: string) => {
    try {
      await window.secretDesk.contexts.switch(contextName);
      dispatch({ type: 'SET_CURRENT_CONTEXT', context: contextName });
    } catch (err) {
      dispatch({ type: 'SET_ERROR', error: `Failed to switch context: ${(err as Error).message}` });
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    await deleteContext(deleteTarget);
    setDeleteTarget(null);
  };

  const isOnline = state.currentContext && !state.error;

  return (
    <aside className="flex w-50 shrink-0 flex-col border-r border-border bg-sidebar text-sidebar-foreground">
      <div className="h-10 px-3.5 pt-3 app-drag-region" />

      <div className="px-3.5 pt-3.5 pb-2.5 no-drag">
        <div className="mb-3.5 flex items-center gap-2.5">
          <IconMark size={22} />
          <span className="font-display text-sm font-semibold tracking-[-0.01em] text-foreground">
            SecretDesk
          </span>
        </div>

        {state.contexts.length > 0 ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex w-full items-center justify-between rounded-md border border-border bg-panel px-2.5 py-1.5 text-left text-foreground transition-colors hover:bg-panel-2">
                <span className="flex items-center gap-2">
                  <span
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ background: isOnline ? 'var(--color-ok)' : 'var(--color-danger)' }}
                  />
                  <span className="font-mono text-[11.5px] truncate max-w-[120px]">
                    {state.currentContext || 'Select context'}
                  </span>
                </span>
                <ChevronDown className="h-3 w-3 shrink-0 opacity-50" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="start"
              className="min-w-[var(--radix-dropdown-menu-trigger-width)] max-w-96"
            >
              {state.contexts.map((ctx) => (
                <DropdownMenuItem
                  key={ctx.name}
                  className="flex items-center justify-between gap-2 text-xs"
                  onSelect={() => {
                    if (ctx.name !== state.currentContext) handleContextSwitch(ctx.name);
                  }}
                >
                  <div className="flex min-w-0 items-center gap-2">
                    <Check
                      className={cn(
                        'h-3 w-3 shrink-0',
                        ctx.name !== state.currentContext && 'invisible',
                      )}
                    />
                    <span className="font-mono">{ctx.name}</span>
                  </div>
                  {state.contexts.length > 1 && (
                    <button
                      className="shrink-0 rounded p-0.5 text-muted hover:bg-accent-soft hover:text-accent"
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteTarget(ctx.name);
                      }}
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        ) : state.loading.contexts ? (
          <div className="flex h-8 items-center gap-2 text-xs text-muted">
            <Loader2 className="h-3 w-3 animate-spin" />
            Loading contexts…
          </div>
        ) : (
          <div className="flex h-8 items-center text-xs text-muted">No contexts found</div>
        )}
      </div>

      <div className="px-2 pt-2 pb-1.5 font-sans text-[10px] font-semibold uppercase tracking-[0.08em] text-faint">
        <span className="px-2">Namespaces</span>
      </div>

      <ScrollArea className="flex-1 px-2">
        {state.loading.namespaces ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-4 w-4 animate-spin text-muted" />
          </div>
        ) : state.error && state.namespaces.length === 0 ? (
          <div className="flex flex-col items-center gap-3 px-2 py-8 text-center">
            <AlertTriangle className="h-5 w-5 text-danger opacity-60" />
            <p className="text-xs text-muted">Failed to connect</p>
            <button
              className="inline-flex h-7 items-center gap-1 rounded-md border border-border bg-panel px-2.5 text-xs text-foreground transition-colors hover:bg-panel-2"
              onClick={retry}
            >
              <RefreshCw className="h-3 w-3" />
              Retry
            </button>
          </div>
        ) : state.namespaces.length === 0 ? (
          <div className="px-2 py-8 text-center text-xs text-muted">
            {state.currentContext ? 'No namespaces found' : 'Select a context'}
          </div>
        ) : (
          <nav className="space-y-px">
            {state.namespaces.map((ns) => {
              const active = state.selectedNamespace === ns;
              return (
                <button
                  key={ns}
                  onClick={() => dispatch({ type: 'SET_SELECTED_NAMESPACE', namespace: ns })}
                  className={cn(
                    'flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-[12.5px] transition-colors',
                    active
                      ? 'bg-accent-soft font-medium text-foreground'
                      : 'text-foreground/85 hover:bg-panel-2',
                  )}
                >
                  <span
                    className="h-[5px] w-[5px] shrink-0 rounded-[1.5px]"
                    style={{
                      background: active ? 'var(--color-accent)' : 'var(--color-faint)',
                    }}
                  />
                  <span className="truncate">{ns}</span>
                </button>
              );
            })}
          </nav>
        )}
      </ScrollArea>

      <div className="flex items-center justify-between border-t border-border-soft px-3.5 py-3 font-sans text-[11px] text-faint">
        <span style={{ color: isOnline ? 'var(--color-ok)' : 'var(--color-danger)' }}>
          ● {isOnline ? 'online' : 'offline'}
        </span>
        <span className="font-mono">{APP_VERSION}</span>
      </div>

      <ConfirmDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
        title="Delete context"
        description={`Are you sure you want to delete "${deleteTarget}"? This will remove the context and any orphaned cluster/user entries from your kubeconfig.`}
        onConfirm={handleDeleteConfirm}
        confirmText="Delete"
        variant="destructive"
      />
    </aside>
  );
}
