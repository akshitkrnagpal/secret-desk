import { AppProvider } from '@/context/AppContext';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { SecretList } from '@/components/secrets/SecretList';
import { SecretEditor } from '@/components/secrets/SecretEditor';
import { ErrorState } from '@/components/common/ErrorState';
import { useAppContext } from '@/context/AppContext';
import { Toaster } from 'sonner';

function AppContent() {
  const { state, retry } = useAppContext();

  return (
    <div className="flex h-screen flex-row">
      <Sidebar />
      <main className="flex flex-1 flex-col overflow-hidden shadow-xl">
        <Header />
        <div className="flex-1 overflow-auto">
          {state.error ? (
            <ErrorState message={state.error} onRetry={retry} />
          ) : state.selectedSecret ? (
            <SecretEditor />
          ) : (
            <SecretList />
          )}
        </div>
      </main>
      <Toaster richColors position="bottom-right" />
    </div>
  );
}

export function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
