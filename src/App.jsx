import AppShell from './components/layout/AppShell.jsx';
import AppRoutes from './routes.jsx';
import { useAuth } from './hooks/useAuth.js';

export default function App() {
  const { loading } = useAuth();

  if (loading) {
    return <p className="shell muted">Loading…</p>;
  }

  return (
    <AppShell>
      <AppRoutes />
    </AppShell>
  );
}
