import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, Trash2 } from 'lucide-react';
import type { SecretEntry } from '../../../shared/types';

interface SecretRowProps {
  entry: SecretEntry;
  index: number;
  onChange: (entry: SecretEntry) => void;
  onRemove: () => void;
}

export function SecretRow({ entry, onChange, onRemove }: SecretRowProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="grid grid-cols-[1fr_1fr_auto_auto] gap-2 items-center px-4 py-2">
      <Input
        value={entry.key}
        onChange={(e) => onChange({ ...entry, key: e.target.value })}
        placeholder="KEY_NAME"
        className="font-mono text-xs h-8"
      />
      {entry.isBinary ? (
        <div className="flex items-center h-8 px-3 text-xs text-muted-foreground bg-muted rounded-md border">
          [Binary data]
        </div>
      ) : (
        <Input
          type={visible ? 'text' : 'password'}
          value={entry.value}
          onChange={(e) => onChange({ ...entry, value: e.target.value })}
          placeholder="value"
          className="font-mono text-xs h-8"
        />
      )}
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={() => setVisible(!visible)}
        disabled={entry.isBinary}
      >
        {visible ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-muted-foreground hover:text-destructive"
        onClick={onRemove}
      >
        <Trash2 className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}
