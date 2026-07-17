import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import JobsPage from './pages/JobsPage.jsx';
import JobDetailPage from './pages/JobDetailPage.jsx';
import PostJobPage from './pages/PostJobPage.jsx';
import MyJobsPage from './pages/MyJobsPage.jsx';
import MyBidsPage from './pages/MyBidsPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<JobsPage />} />
      <Route path="/jobs/:id" element={<JobDetailPage />} />
      <Route path="/users/:id" element={<ProfilePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/post-job" element={<PostJobPage />} />
        <Route path="/my-jobs" element={<MyJobsPage />} />
        <Route path="/my-bids" element={<MyBidsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
