import { Plus } from 'lucide-react';

interface AddRowButtonProps {
  onClick: () => void;
}

export function AddRowButton({ onClick }: AddRowButtonProps) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center justify-center gap-1.5 rounded-[9px] border border-dashed border-border bg-transparent px-3 py-2.5 text-xs text-muted transition-colors hover:bg-panel/40"
    >
      <Plus className="h-3.5 w-3.5" />
      Add key
    </button>
  );
}
