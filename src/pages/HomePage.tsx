import { useAuth } from '../hooks/useAuth';
import JobsPage from './JobsPage';
import ClientHomePage from './ClientHomePage';

export default function HomePage() {
  const { user } = useAuth();
  return user?.activeRole === 'CLIENT' ? <ClientHomePage /> : <JobsPage />;
}
