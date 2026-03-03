import { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { cn } from '@/lib/utils';
import { Loader2, FolderOpen, AlertTriangle, RefreshCw, ChevronDown, Check, Trash2 } from 'lucide-react';

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

  return (
    <aside className="w-56 shrink-0 bg-sidebar text-sidebar-foreground">
      <div className="h-12 app-drag-region" />
      <div className="px-3 py-3 no-drag">
        {state.contexts.length > 0 ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full h-8 justify-between text-xs font-normal">
                <span className="truncate">{state.currentContext || 'Select context'}</span>
                <ChevronDown className="h-3 w-3 shrink-0 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="min-w-[var(--radix-dropdown-menu-trigger-width)] max-w-96">
              {state.contexts.map((ctx) => (
                <DropdownMenuItem
                  key={ctx.name}
                  className="flex items-center justify-between gap-2 text-xs"
                  onSelect={() => {
                    if (ctx.name !== state.currentContext) {
                      handleContextSwitch(ctx.name);
                    }
                  }}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <Check className={cn('h-3 w-3 shrink-0', ctx.name !== state.currentContext && 'invisible')} />
                    <span>{ctx.name}</span>
                  </div>
                  {state.contexts.length > 1 && (
                    <button
                      className="shrink-0 rounded p-0.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
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
          <div className="flex items-center gap-2 text-xs text-muted-foreground h-8">
            <Loader2 className="h-3 w-3 animate-spin" />
            Loading contexts...
          </div>
        ) : (
          <div className="text-xs text-muted-foreground h-8 flex items-center">
            No contexts found
          </div>
        )}
      </div>
      <div className="flex h-10 items-center px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
        Namespaces
      </div>
      <ScrollArea className="h-[calc(100vh-10rem)]">
        {state.loading.namespaces ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          </div>
        ) : state.error && state.namespaces.length === 0 ? (
          <div className="flex flex-col items-center gap-3 px-4 py-8 text-center">
            <AlertTriangle className="h-5 w-5 text-destructive opacity-60" />
            <p className="text-xs text-muted-foreground">Failed to connect</p>
            <Button variant="outline" size="sm" className="h-7 text-xs" onClick={retry}>
              <RefreshCw className="h-3 w-3 mr-1" />
              Retry
            </Button>
          </div>
        ) : state.namespaces.length === 0 ? (
          <div className="px-4 py-8 text-center text-xs text-muted-foreground">
            {state.currentContext ? 'No namespaces found' : 'Select a context'}
          </div>
        ) : (
          <nav className="space-y-0.5 px-2">
            {state.namespaces.map((ns) => (
              <button
                key={ns}
                onClick={() => {
                  dispatch({ type: 'SET_SELECTED_NAMESPACE', namespace: ns });
                }}
                className={cn(
                  'flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-accent',
                  state.selectedNamespace === ns && 'bg-accent text-accent-foreground font-medium',
                )}
              >
                <FolderOpen className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                <span className="truncate">{ns}</span>
              </button>
            ))}
          </nav>
        )}
      </ScrollArea>

      <ConfirmDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => { if (!open) setDeleteTarget(null); }}
        title="Delete context"
        description={`Are you sure you want to delete "${deleteTarget}"? This will remove the context and any orphaned cluster/user entries from your kubeconfig.`}
        onConfirm={handleDeleteConfirm}
        confirmText="Delete"
        variant="destructive"
      />
    </aside>
  );
}
