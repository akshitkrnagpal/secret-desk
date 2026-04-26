import { useAppContext } from '@/context/AppContext';
import { Sun, Moon, Monitor } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function ThemeToggle() {
  const { state, dispatch } = useAppContext();
  const Icon = state.theme === 'light' ? Sun : state.theme === 'dark' ? Moon : Monitor;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="rounded p-1.5 text-muted hover:bg-panel-2"
          title="Theme"
        >
          <Icon className="h-3.5 w-3.5" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => dispatch({ type: 'SET_THEME', theme: 'light' })}>
          <Sun className="mr-2 h-3.5 w-3.5" />
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => dispatch({ type: 'SET_THEME', theme: 'dark' })}>
          <Moon className="mr-2 h-3.5 w-3.5" />
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => dispatch({ type: 'SET_THEME', theme: 'system' })}>
          <Monitor className="mr-2 h-3.5 w-3.5" />
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
