import { useAppContext } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Sun, Moon, Monitor, Wifi, WifiOff } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function Header() {
  const { state, dispatch } = useAppContext();

  const themeIcon = state.theme === 'light' ? <Sun className="h-4 w-4" /> : state.theme === 'dark' ? <Moon className="h-4 w-4" /> : <Monitor className="h-4 w-4" />;

  const isConnected = state.currentContext && !state.error;

  return (
    <header className="flex h-12 shrink-0 items-center justify-between px-4 app-drag-region">
      <div />

      <h1 className="text-sm font-semibold">SecretDesk</h1>

      <div className="flex items-center gap-2 no-drag">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          {isConnected ? (
            <Wifi className="h-3.5 w-3.5 text-green-500" />
          ) : (
            <WifiOff className="h-3.5 w-3.5 text-destructive" />
          )}
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              {themeIcon}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => dispatch({ type: 'SET_THEME', theme: 'light' })}>
              <Sun className="mr-2 h-4 w-4" />
              Light
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => dispatch({ type: 'SET_THEME', theme: 'dark' })}>
              <Moon className="mr-2 h-4 w-4" />
              Dark
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => dispatch({ type: 'SET_THEME', theme: 'system' })}>
              <Monitor className="mr-2 h-4 w-4" />
              System
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
