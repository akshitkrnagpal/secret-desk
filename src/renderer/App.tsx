import { AppProvider, useAppContext } from '@/context/AppContext';
import { Sidebar } from '@/components/layout/Sidebar';
import { SecretList } from '@/components/secrets/SecretList';
import { SecretEditor } from '@/components/secrets/SecretEditor';
import { ErrorState } from '@/components/common/ErrorState';
import { Toaster } from 'sonner';

function AppContent() {
  const { state, retry } = useAppContext();

  return (
    <div className="flex h-screen flex-row bg-background text-foreground">
      <Sidebar />
      {state.error && state.namespaces.length === 0 ? (
        <main className="flex flex-1 items-center justify-center bg-background">
          <ErrorState message={state.error} onRetry={retry} />
        </main>
      ) : (
        <>
          <SecretList />
          <SecretEditor />
        </>
      )}
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
