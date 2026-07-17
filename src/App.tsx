import AppShell from './components/layout/AppShell';
import AppRoutes from './routes';
import { useAuth } from './hooks/useAuth';

export default function App() {
  const { loading } = useAuth();

  if (loading) {
    return <p className="mx-auto max-w-295 px-7 pt-7 pb-15 text-muted">Loading…</p>;
  }

  return (
    <AppShell>
      <AppRoutes />
    </AppShell>
  );
}
