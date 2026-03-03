import { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/common/EmptyState';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { CreateSecretDialog } from '@/components/secrets/CreateSecretDialog';
import { Loader2, Plus, Trash2, KeyRound } from 'lucide-react';
import { toast } from 'sonner';

export function SecretList() {
  const { state, dispatch } = useAppContext();
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);

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
    } catch (err) {
      toast.error(`Failed to delete secret: ${(err as Error).message}`);
    }
    setDeleteTarget(null);
  };

  if (!state.selectedNamespace) {
    return <EmptyState icon={<KeyRound className="h-10 w-10" />} title="Select a namespace" description="Choose a namespace from the sidebar to view its secrets." />;
  }

  if (state.loading.secrets) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold">Secrets</h2>
          <p className="text-sm text-muted-foreground">{state.selectedNamespace} &middot; {state.secrets.length} secret{state.secrets.length !== 1 ? 's' : ''}</p>
        </div>
        <Button size="sm" onClick={() => setShowCreate(true)}>
          <Plus className="h-4 w-4 mr-1" />
          New Secret
        </Button>
      </div>

      {state.secrets.length === 0 ? (
        <EmptyState icon={<KeyRound className="h-10 w-10" />} title="No secrets" description="This namespace has no secrets yet. Create one to get started." />
      ) : (
        <div className="rounded-md border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Name</th>
                <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Type</th>
                <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Entries</th>
                <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Created</th>
                <th className="px-4 py-2.5 w-10"></th>
              </tr>
            </thead>
            <tbody>
              {state.secrets.map((secret) => (
                <tr
                  key={secret.name}
                  className="border-b last:border-0 hover:bg-muted/30 cursor-pointer transition-colors"
                  onClick={() => handleSelect(secret.name)}
                >
                  <td className="px-4 py-2.5 font-mono text-xs">{secret.name}</td>
                  <td className="px-4 py-2.5">
                    <Badge variant="secondary" className="text-xs font-normal">
                      {secret.type}
                    </Badge>
                  </td>
                  <td className="px-4 py-2.5 text-muted-foreground">{secret.entries}</td>
                  <td className="px-4 py-2.5 text-muted-foreground">
                    {secret.createdAt ? new Date(secret.createdAt).toLocaleDateString() : '-'}
                  </td>
                  <td className="px-4 py-2.5">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-muted-foreground hover:text-destructive"
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteTarget(secret.name);
                      }}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete Secret"
        description={`Are you sure you want to delete "${deleteTarget}"? This action cannot be undone.`}
        onConfirm={handleDelete}
        confirmText="Delete"
        variant="destructive"
      />

      <CreateSecretDialog
        open={showCreate}
        onOpenChange={setShowCreate}
      />
    </div>
  );
}
