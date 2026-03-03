import { createContext, useContext, useReducer, useEffect, useCallback, type ReactNode } from 'react';
import { toast } from 'sonner';
import type { ClusterContext, SecretSummary, SecretDetail, SecretEntry } from '../../shared/types';

type Theme = 'light' | 'dark' | 'system';

interface AppState {
  contexts: ClusterContext[];
  currentContext: string;
  namespaces: string[];
  selectedNamespace: string;
  secrets: SecretSummary[];
  selectedSecret: SecretDetail | null;
  editEntries: SecretEntry[];
  loading: { contexts: boolean; namespaces: boolean; secrets: boolean; secretDetail: boolean };
  error: string | null;
  theme: Theme;
}

type Action =
  | { type: 'SET_CONTEXTS'; contexts: ClusterContext[]; current: string }
  | { type: 'SET_CURRENT_CONTEXT'; context: string }
  | { type: 'SET_NAMESPACES'; namespaces: string[] }
  | { type: 'SET_SELECTED_NAMESPACE'; namespace: string }
  | { type: 'SET_SECRETS'; secrets: SecretSummary[] }
  | { type: 'SET_SELECTED_SECRET'; secret: SecretDetail | null }
  | { type: 'SET_EDIT_ENTRIES'; entries: SecretEntry[] }
  | { type: 'UPDATE_EDIT_ENTRY'; index: number; entry: SecretEntry }
  | { type: 'ADD_EDIT_ENTRY' }
  | { type: 'REMOVE_EDIT_ENTRY'; index: number }
  | { type: 'SET_LOADING'; key: keyof AppState['loading']; value: boolean }
  | { type: 'SET_ERROR'; error: string | null }
  | { type: 'SET_THEME'; theme: Theme };

const initialState: AppState = {
  contexts: [],
  currentContext: '',
  namespaces: [],
  selectedNamespace: '',
  secrets: [],
  selectedSecret: null,
  editEntries: [],
  loading: { contexts: false, namespaces: false, secrets: false, secretDetail: false },
  error: null,
  theme: (localStorage.getItem('theme') as Theme) || 'system',
};

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_CONTEXTS':
      return { ...state, contexts: action.contexts, currentContext: action.current };
    case 'SET_CURRENT_CONTEXT':
      return { ...state, currentContext: action.context, namespaces: [], selectedNamespace: '', secrets: [], selectedSecret: null, editEntries: [] };
    case 'SET_NAMESPACES':
      return { ...state, namespaces: action.namespaces };
    case 'SET_SELECTED_NAMESPACE':
      return { ...state, selectedNamespace: action.namespace, secrets: [], selectedSecret: null, editEntries: [] };
    case 'SET_SECRETS':
      return { ...state, secrets: action.secrets };
    case 'SET_SELECTED_SECRET':
      return {
        ...state,
        selectedSecret: action.secret,
        editEntries: action.secret ? action.secret.entries.map((e) => ({ ...e })) : [],
      };
    case 'SET_EDIT_ENTRIES':
      return { ...state, editEntries: action.entries };
    case 'UPDATE_EDIT_ENTRY': {
      const entries = [...state.editEntries];
      entries[action.index] = action.entry;
      return { ...state, editEntries: entries };
    }
    case 'ADD_EDIT_ENTRY':
      return { ...state, editEntries: [...state.editEntries, { key: '', value: '', isBinary: false }] };
    case 'REMOVE_EDIT_ENTRY':
      return { ...state, editEntries: state.editEntries.filter((_, i) => i !== action.index) };
    case 'SET_LOADING':
      return { ...state, loading: { ...state.loading, [action.key]: action.value } };
    case 'SET_ERROR':
      return { ...state, error: action.error };
    case 'SET_THEME':
      return { ...state, theme: action.theme };
    default:
      return state;
  }
}

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  const isDark =
    theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  root.classList.toggle('dark', isDark);
  localStorage.setItem('theme', theme);
}

interface AppContextValue {
  state: AppState;
  dispatch: React.Dispatch<Action>;
  retry: () => void;
  deleteContext: (contextName: string) => Promise<void>;
}

const AppContext = createContext<AppContextValue | null>(null);

export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppContext must be used within AppProvider');
  return ctx;
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Apply theme on mount and when it changes
  useEffect(() => {
    applyTheme(state.theme);
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => {
      if (state.theme === 'system') applyTheme('system');
    };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [state.theme]);

  const loadContexts = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', key: 'contexts', value: true });
    dispatch({ type: 'SET_ERROR', error: null });
    try {
      const [contexts, current] = await Promise.all([
        window.secretDesk.contexts.list(),
        window.secretDesk.contexts.current(),
      ]);
      dispatch({ type: 'SET_CONTEXTS', contexts, current });
    } catch (err) {
      dispatch({ type: 'SET_ERROR', error: `Failed to load kubeconfig: ${(err as Error).message}` });
    } finally {
      dispatch({ type: 'SET_LOADING', key: 'contexts', value: false });
    }
  }, []);

  const loadNamespaces = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', key: 'namespaces', value: true });
    dispatch({ type: 'SET_ERROR', error: null });
    try {
      const namespaces = await window.secretDesk.namespaces.list();
      dispatch({ type: 'SET_NAMESPACES', namespaces });
      if (namespaces.length > 0) {
        dispatch({ type: 'SET_SELECTED_NAMESPACE', namespace: namespaces.includes('default') ? 'default' : namespaces[0] });
      }
    } catch (err) {
      dispatch({ type: 'SET_ERROR', error: `Failed to list namespaces: ${(err as Error).message}` });
    } finally {
      dispatch({ type: 'SET_LOADING', key: 'namespaces', value: false });
    }
  }, []);

  const loadSecrets = useCallback(async (namespace: string) => {
    dispatch({ type: 'SET_LOADING', key: 'secrets', value: true });
    try {
      const secrets = await window.secretDesk.secrets.list(namespace);
      dispatch({ type: 'SET_SECRETS', secrets });
    } catch (err) {
      dispatch({ type: 'SET_ERROR', error: `Failed to list secrets: ${(err as Error).message}` });
    } finally {
      dispatch({ type: 'SET_LOADING', key: 'secrets', value: false });
    }
  }, []);

  // Load contexts on mount
  useEffect(() => { loadContexts(); }, [loadContexts]);

  // Load namespaces when context changes
  useEffect(() => {
    if (state.currentContext) loadNamespaces();
  }, [state.currentContext, loadNamespaces]);

  // Load secrets when namespace changes
  useEffect(() => {
    if (state.selectedNamespace) loadSecrets(state.selectedNamespace);
  }, [state.selectedNamespace, loadSecrets]);

  const deleteCtx = useCallback(async (contextName: string) => {
    try {
      await window.secretDesk.contexts.delete(contextName);
      await loadContexts();
      toast.success(`Context "${contextName}" deleted`);
    } catch (err) {
      toast.error(`Failed to delete context: ${(err as Error).message}`);
    }
  }, [loadContexts]);

  const retry = useCallback(() => {
    if (!state.currentContext) {
      loadContexts();
    } else if (state.namespaces.length === 0) {
      loadNamespaces();
    } else if (state.selectedNamespace) {
      loadSecrets(state.selectedNamespace);
    }
  }, [state.currentContext, state.namespaces.length, state.selectedNamespace, loadContexts, loadNamespaces, loadSecrets]);

  return <AppContext.Provider value={{ state, dispatch, retry, deleteContext: deleteCtx }}>{children}</AppContext.Provider>;
}
