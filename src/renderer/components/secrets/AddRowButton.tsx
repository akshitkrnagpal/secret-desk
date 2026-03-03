import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface AddRowButtonProps {
  onClick: () => void;
}

export function AddRowButton({ onClick }: AddRowButtonProps) {
  return (
    <div className="px-4 py-3 border-t">
      <Button variant="ghost" size="sm" className="text-xs text-muted-foreground" onClick={onClick}>
        <Plus className="h-3.5 w-3.5 mr-1" />
        Add Another
      </Button>
    </div>
  );
}
