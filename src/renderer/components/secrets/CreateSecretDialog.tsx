import { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

interface CreateSecretDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateSecretDialog({ open, onOpenChange }: CreateSecretDialogProps) {
  const { state, dispatch } = useAppContext();
  const [name, setName] = useState('');
  const [type, setType] = useState('Opaque');

  const handleCreate = async () => {
    if (!name.trim()) {
      toast.error('Secret name is required');
      return;
    }
    try {
      const secret = await window.secretDesk.secrets.create(
        state.selectedNamespace,
        name.trim(),
        [],
        type,
      );
      dispatch({ type: 'SET_SELECTED_SECRET', secret });
      toast.success(`Secret "${name}" created`);
      // Refresh list
      const secrets = await window.secretDesk.secrets.list(state.selectedNamespace);
      dispatch({ type: 'SET_SECRETS', secrets });
      onOpenChange(false);
      setName('');
      setType('Opaque');
    } catch (err) {
      toast.error(`Failed to create secret: ${(err as Error).message}`);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Secret</DialogTitle>
          <DialogDescription>
            Create a new secret in {state.selectedNamespace}.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <label className="text-sm font-medium">Name</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="my-secret"
              className="font-mono text-sm"
              autoFocus
              onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Type</label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Opaque">Opaque</SelectItem>
                <SelectItem value="kubernetes.io/tls">kubernetes.io/tls</SelectItem>
                <SelectItem value="kubernetes.io/dockerconfigjson">kubernetes.io/dockerconfigjson</SelectItem>
                <SelectItem value="kubernetes.io/basic-auth">kubernetes.io/basic-auth</SelectItem>
                <SelectItem value="kubernetes.io/ssh-auth">kubernetes.io/ssh-auth</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleCreate}>Create</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
