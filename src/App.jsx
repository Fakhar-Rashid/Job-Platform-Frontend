import AppShell from './components/layout/AppShell.jsx';
import AppRoutes from './routes.jsx';
import { useAuth } from './hooks/useAuth.js';

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
